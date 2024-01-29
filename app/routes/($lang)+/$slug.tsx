import {
	json,
	redirect,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import {
	typedjson,
	UseDataFunctionReturn,
	useTypedLoaderData,
} from 'remix-typedjson'

import { GeneralErrorBoundary, NotFoundError } from '#app/components/errors.tsx'
import {
	getStoriesForSitemap,
	getStoryBySlug,
} from '#app/lib/storyblok.server.ts'
import { pathedRoutes } from '#app/other-routes.server.ts'
import type { LoaderData as RootLoaderData } from '#app/root.tsx'
import type { Handle } from '#app/types.ts'
import type { DynamicLinksFunction } from '#app/utils/dynamic-links.tsx'
import {
	defaultLanguage,
	getLanguageFromContext,
	getStaticLabel,
	isSupportedLanguage,
} from '#app/utils/i18n.ts'
import { createAlternateLinks, getUrl } from '#app/utils/misc.tsx'
import { getSocialMetas } from '#app/utils/seo.ts'
import {
	getTranslatedSlugsFromStory,
	isPreview,
} from '#app/utils/storyblok.tsx'

const dynamicLinks: DynamicLinksFunction<
	UseDataFunctionReturn<typeof loader>
> = ({ data, parentsData }) => {
	const requestInfo = parentsData[0].requestInfo
	const slugs = getTranslatedSlugsFromStory(data?.story)
	return createAlternateLinks(slugs, requestInfo.origin)
}

export const handle: Handle = {
	getSitemapEntries: async language => {
		const pages = await getStoriesForSitemap(language)
		return pages.map(page => ({
			route: `${
				page.slug === 'home'
					? `${language === defaultLanguage ? '' : `/${language}`}`
					: `/${page.full_slug}`
			}`,
			priority: 0.4,
		}))
	},
	dynamicLinks,
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
	const preview = isPreview(request)
	const language = getLanguageFromContext(context)
	const { pathname } = new URL(request.url)

	// Block the layout path when not in preview mode
	if (pathedRoutes[pathname] || (!preview && pathname === '/layout')) {
		throw new Response('Use other route', { status: 404 })
	}

	// Include whatever is in params.lang if it is not a supported langauge.
	// This way we support arbitrary nested routes.
	const slugStart =
		params.slug && !isSupportedLanguage(params.lang) ? `${params.lang}/` : ''
	const slugOrHome =
		!params.slug && params.lang === language
			? 'home'
			: params.slug ?? params.lang ?? 'home'
	const slug = `${slugStart}${slugOrHome}`

	const story = await getStoryBySlug(slug, language, preview)

	if (!story) {
		throw json({}, { status: 404 })
	}

	if (pathname.includes('home')) {
		throw redirect('/')
	}

	// Home page has slug "home" but we don't want that url to work
	if (pathname.includes('home')) {
		throw redirect(language === defaultLanguage ? '/' : `/${language}`)
	}

	// Make sure a translated story cannot be requested using the default slug (e.g. /nl/about)
	if (
		story.slug !== 'home' &&
		language !== defaultLanguage &&
		pathname !== `/${story.full_slug}`
	) {
		throw redirect(`/${story.full_slug}`)
	}

	const data = {
		story,
		preview,
	}

	return typedjson(data, {
		status: 200,
		headers: {
			'Cache-Control': 'private, max-age=3600',
		},
	})
}

export const meta: MetaFunction = ({ data, parentsData }) => {
	const { requestInfo, language } = parentsData.root as RootLoaderData

	if (data?.story) {
		const meta = data.story.content.metatags
		return {
			...getSocialMetas({
				title: meta?.title,
				description: meta?.description,
				image: meta?.og_image,
				url: getUrl(requestInfo),
			}),
		}
	} else {
		return {
			title: getStaticLabel('404.meta.title', language),
			description: getStaticLabel('404.meta.description', language),
		}
	}
}

export default function SlugRoute() {
	const data = useTypedLoaderData<typeof loader>()
	const story = useStoryblokState(data.story, {})

	return (
		<main>
			<StoryblokComponent blok={story.content} />
		</main>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary statusHandlers={{ 404: NotFoundError }} />
}
