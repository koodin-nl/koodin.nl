import type { EntryContext } from '@remix-run/node'
import type { Handle, SitemapEntry } from '~/types'
import type { SupportedLanguage } from '~/utils/i18n'
import { getDomainUrl, removeTrailingSlash, typedBoolean } from '~/utils/misc'
import { isEqual } from 'lodash'

export async function getSitemapXml(
	request: Request,
	remixContext: EntryContext,
	language: SupportedLanguage,
) {
	const domainUrl = getDomainUrl(request)

	function getEntry({ route, lastmod, changefreq, priority }: SitemapEntry) {
		return `
<url>
  <loc>${domainUrl}${route}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
  ${priority ? `<priority>${priority}</priority>` : ''}
</url>
    `.trim()
	}

	const rawSitemapEntries = (
		await Promise.all(
			Object.entries(remixContext.routeModules).map(async ([id, mod]) => {
				if (id === 'root') return
				if (id.startsWith('routes/_')) return

				const handle = mod.handle as Handle | undefined
				if (handle?.getSitemapEntries) {
					return handle.getSitemapEntries(language, request)
				}

				// Exclude resource routes from the sitemap
				// (these are an opt-in via the getSitemapEntries method)
				if (!('default' in mod)) return

				const manifestEntry = remixContext.manifest.routes[id]
				if (!manifestEntry) {
					console.warn(`Could not find a manifest entry for ${id}`)
					return
				}

				let parentId = manifestEntry.parentId
				let parent = parentId ? remixContext.manifest.routes[parentId] : null

				let path
				if (manifestEntry.path) {
					path = removeTrailingSlash(manifestEntry.path)
				} else if (manifestEntry.index) {
					path = ''
				} else {
					return
				}

				while (parent) {
					// the root path is '/', so it messes things up if we add another '/'
					const parentPath = parent.path ? removeTrailingSlash(parent.path) : ''
					path = `${parentPath}/${path}`
					parentId = parent.parentId
					parent = parentId ? remixContext.manifest.routes[parentId] : null
				}

				if (path.includes(':')) return
				if (id === 'root') return

				const entry: SitemapEntry = { route: removeTrailingSlash(path) }
				return entry
			}),
		)
	)
		.flat()
		.filter(typedBoolean)

	const sitemapEntries: SitemapEntry[] = []
	for (const entry of rawSitemapEntries) {
		const existingEntryForRoute = sitemapEntries.find(
			e => e.route === entry.route,
		)
		if (existingEntryForRoute) {
			if (!isEqual(existingEntryForRoute, entry)) {
				console.warn(
					`Duplicate route for ${entry.route} with different sitemap data`,
					{ entry, existingEntryForRoute },
				)
			}
		} else {
			sitemapEntries.push(entry)
		}
	}

	return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  ${sitemapEntries.map(entry => getEntry(entry)).join('')}
</urlset>
  `.trim()
}
