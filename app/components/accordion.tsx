import * as React from 'react'

import {
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Accordion as ReachAccordion,
	useAccordionItemContext,
} from '@reach/accordion'
import { H5 } from '~/components/typography'
import type { Section } from '~/types'
import { Markdown } from '~/utils/markdown'
import clsx from 'clsx'
import { motion } from 'framer-motion'

function AccordionItemContent({
	title,
	text,
}: {
	title: string
	text: string
}) {
	const { isExpanded } = useAccordionItemContext()

	return (
		<>
			<div>
				<AccordionButton className="md:gap6 group relative flex w-full justify-between gap-4 py-6 text-left">
					<H5 as="span" inverse>
						{title}
					</H5>

					<span
						className={clsx(
							'h-8 w-8',
							'flex items-center justify-center',
							'transition',
							isExpanded ? 'text-blue-500' : 'text-white',
						)}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g>
								<path
									d="M15 12.75C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H15Z"
									fill="currentColor"
								/>
							</g>
							<g transform-origin="50% 50%" transform="rotate(90)">
								<motion.path
									d="M15 12.75C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H15Z"
									fill="currentColor"
									animate={{ fillOpacity: isExpanded ? 0 : 1 }}
								/>
							</g>
							<path
								d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z"
								fill="currentColor"
							/>
						</svg>
					</span>
				</AccordionButton>
			</div>
			<AccordionPanel
				as={motion.div}
				className="block overflow-hidden lg:pr-16"
				initial={false}
				animate={
					isExpanded
						? { opacity: 1, height: 'auto' }
						: { opacity: 0, height: 0 }
				}
			>
				<Markdown bodyTextSize="md" textColor="inverse">
					{text}
				</Markdown>
			</AccordionPanel>
		</>
	)
}

export function Accordion({ items }: { items: Section[] }) {
	return (
		<ReachAccordion collapsible>
			{items.map(item => (
				<AccordionItem key={item.id} className="border-secondary border-b">
					<AccordionItemContent title={item.title} text={item.text} />
				</AccordionItem>
			))}
		</ReachAccordion>
	)
}
