'use client'
import type { ModalProps } from '@nextui-org/react'

import { TRANSITION_EASINGS } from '@nextui-org/framer-utils'
import { cn, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { forwardRef, useMemo } from 'react'

const SidebarDrawer = forwardRef<
	HTMLDivElement,
	ModalProps & {
		sidebarWidth?: number
		sidebarPlacement?: 'left' | 'right'
	}
>(
	(
		{
			children,
			className,
			onOpenChange,
			isOpen,
			sidebarWidth = 288,
			classNames = {},
			sidebarPlacement = 'left',
			motionProps: drawerMotionProps,
			...props
		},
		ref,
	) => {
		const motionProps = useMemo(() => {
			if (!!drawerMotionProps && typeof drawerMotionProps === 'object') {
				return drawerMotionProps
			}

			return {
				variants: {
					enter: {
						x: 0,
						transition: {
							x: {
								duration: 0.3,
								ease: TRANSITION_EASINGS.easeOut,
							},
						},
					},
					exit: {
						x: sidebarPlacement == 'left' ? -sidebarWidth : sidebarWidth,
						transition: {
							x: {
								duration: 0.2,
								ease: TRANSITION_EASINGS.easeOut,
							},
						},
					},
				},
			}
		}, [sidebarWidth, sidebarPlacement, drawerMotionProps])

		return (
			<>
				{/* <div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backdropFilter: 'blur(5px)',
						zIndex: 9999,
					}}
				>
					<Spinner size="lg" color="primary" />
				</div> */}
				<Modal
					ref={ref}
					{...props}
					classNames={{
						...classNames,
						wrapper: cn('!w-[var(--sidebar-width)]', classNames?.wrapper, {
							'!items-start !justify-start ': sidebarPlacement === 'left',
							'!items-end !justify-end': sidebarPlacement === 'right',
						}),
						base: cn('w-[var(--sidebar-width)] !m-0 p-0 h-full max-h-full', classNames?.base, className, {
							'inset-y-0 left-0 max-h-[none] rounded-l-none !justify-start': sidebarPlacement === 'left',
							'inset-y-0 right-0 max-h-[none] rounded-r-none !justify-end': sidebarPlacement === 'right',
						}),
						body: cn('p-0', classNames?.body),
						closeButton: cn('z-50', classNames?.closeButton),
					}}
					isOpen={isOpen}
					motionProps={motionProps}
					radius="none"
					scrollBehavior="inside"
					style={{
						// @ts-ignore
						'--sidebar-width': `${sidebarWidth}px`,
					}}
					onOpenChange={onOpenChange}
				>
					<ModalContent>
						<ModalBody>{children}</ModalBody>
					</ModalContent>
				</Modal>
				<div className={cn('hidden h-screen max-w-[var(--sidebar-width)] md:flex', className)}>{children}</div>
			</>
		)
	},
)

SidebarDrawer.displayName = 'SidebarDrawer'

export default SidebarDrawer
