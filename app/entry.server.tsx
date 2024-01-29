import { PassThrough } from 'stream'

import { Response, type HandleDocumentRequestFunction } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { routes as otherRoutes } from '~/other-routes.server'
import { getEnv } from '~/utils/env.server'
import { defaultLanguage, isSupportedLanguage } from '~/utils/i18n'
import { I18nProvider } from '~/utils/i18n-provider'
import { NonceProvider } from '~/utils/nonce-provider'
import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'

global.ENV = getEnv()

const ABORT_DELAY = 5000

// https://github.com/remix-run/remix/discussions/4603
type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

export default async function handleRequest(...args: DocRequestArgs) {
	const [
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	] = args

	for (const handler of otherRoutes) {
		const otherRouteResponse = await handler(request, remixContext)
		if (otherRouteResponse) return otherRouteResponse
	}

	if (process.env.NODE_ENV !== 'production') {
		responseHeaders.set('Cache-Control', 'no-store')
	}

	// Preconnect to storyblok domains (image and script locations)
	responseHeaders.append('Link', '<https://a.storyblok.com>; rel="preconnect"')
	responseHeaders.append(
		'Link',
		'<https://app.storyblok.com>; rel="preconnect"',
	)

	if (isbot(request.headers.get('user-agent'))) {
		return handleBotRequest(
			request,
			responseStatusCode,
			responseHeaders,
			remixContext,
			loadContext,
		)
	}

	return handleBrowserRequest(
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	)
}

function handleBotRequest(...args: DocRequestArgs) {
	const [
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	] = args

	const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : undefined
	const language = isSupportedLanguage(loadContext.language)
		? loadContext.language
		: defaultLanguage

	return new Promise((resolve, reject) => {
		let didError = false

		const { pipe, abort } = renderToPipeableStream(
			<NonceProvider value={nonce}>
				<I18nProvider language={language}>
					<RemixServer context={remixContext} url={request.url} />
				</I18nProvider>
			</NonceProvider>,
			{
				nonce,
				onAllReady() {
					const body = new PassThrough()

					responseHeaders.set('Content-Type', 'text/html')

					resolve(
						new Response(body, {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					)

					pipe(body)
				},
				onShellError(error: unknown) {
					reject(error)
				},
				onError(error: unknown) {
					didError = true

					console.error(error)
				},
			},
		)

		setTimeout(abort, ABORT_DELAY)
	})
}

function handleBrowserRequest(...args: DocRequestArgs) {
	const [
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	] = args

	const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : undefined
	const language = isSupportedLanguage(loadContext.language)
		? loadContext.language
		: defaultLanguage

	return new Promise((resolve, reject) => {
		let didError = false

		const { pipe, abort } = renderToPipeableStream(
			<NonceProvider value={nonce}>
				<I18nProvider language={language}>
					<RemixServer
						context={remixContext}
						url={request.url}
						abortDelay={ABORT_DELAY}
					/>
				</I18nProvider>
			</NonceProvider>,
			{
				nonce,
				onShellReady() {
					const body = new PassThrough()

					responseHeaders.set('Content-Type', 'text/html')

					resolve(
						new Response(body, {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					)

					pipe(body)
				},
				onShellError(err: unknown) {
					reject(err)
				},
				onError(error: unknown) {
					didError = true

					console.error(error)
				},
			},
		)

		setTimeout(abort, ABORT_DELAY)
	})
}
