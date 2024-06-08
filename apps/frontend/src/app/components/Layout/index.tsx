'use client'
import { sectionNestedItems } from '@app/mock/SidebarItem'
import { usePage } from '@app/providers/PageProvider'
import { Icon } from '@iconify/react'
import { Avatar, Button, cn, ScrollShadow, Spacer, Tooltip } from '@nextui-org/react'
import { FC, PropsWithChildren } from 'react'
import AcmeLogo from '../AcmeLogo'
import SidebarDrawer from '../SidebarDrawer'
import SidebarMenuList from '../SidebarMenuList'

const Layout: FC<PropsWithChildren> = ({ children }) => {
	const { isCompactMobile, onOpenChange, isCompactDesktop, isDesktop, isMobile } = usePage()
	return (
		<div className="flex h-dvh w-full">
			<SidebarDrawer
				className="!border-r-small border-divider"
				isOpen={isCompactMobile}
				onOpenChange={onOpenChange}
			>
				<div
					className={cn('relative flex h-full w-72 flex-1 flex-col p-6', {
						'w-16 items-center px-2 py-6': isCompactDesktop,
					})}
				>
					<div
						className={cn(
							'flex items-center',
							{ 'gap-2 px-2': isMobile },
							{ 'gap-3 px-3': isDesktop },
							{
								'justify-center gap-0': isCompactDesktop,
							},
						)}
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
							<AcmeLogo className="text-background" />
						</div>
						<span
							className={cn(
								'text-small font-bold uppercase',
								{ 'text-foreground': isMobile },
								{ 'opacity-100': isDesktop },
								{ 'w-0 opacity-0': isCompactDesktop },
							)}
						>
							Acme
						</span>
					</div>
					<Spacer y={8} />
					<div className="flex items-center gap-3 px-3">
						<Avatar
							isBordered
							size="sm"
							className={cn({ 'flex-none': isDesktop })}
							src="https://i.pravatar.cc/150?u=a04258114e29026708c"
						/>
						<div className={cn('flex max-w-full flex-col', { hidden: isCompactDesktop })}>
							<p className="truncate text-small font-medium text-default-600">John Doe</p>
							<p className="truncate text-tiny text-default-400">Product Designer</p>
						</div>
					</div>

					<ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
						<SidebarMenuList
							isCompact={isCompactDesktop}
							defaultSelectedKey="home"
							items={sectionNestedItems}
						/>
					</ScrollShadow>
					<Spacer y={isDesktop ? 2 : 8} />
					<div
						className={cn('mt-auto flex flex-col', {
							'items-center': isCompactDesktop,
						})}
					>
						<Tooltip content="Help & Feedback" isDisabled={!isCompactDesktop} placement="right">
							<Button
								fullWidth
								className={cn(
									'justify-start truncate text-default-500 data-[hover=true]:text-foreground',
									{
										'justify-center': isCompactDesktop,
									},
								)}
								isIconOnly={isCompactDesktop}
								startContent={
									isCompactDesktop ? null : (
										<Icon
											className="flex-none text-default-500"
											icon="solar:info-circle-line-duotone"
											width={24}
										/>
									)
								}
								variant="light"
							>
								{isCompactDesktop ? (
									<Icon
										className="text-default-500"
										icon="solar:info-circle-line-duotone"
										width={24}
									/>
								) : (
									'Help & Information'
								)}
							</Button>
						</Tooltip>
						<Tooltip content="Log Out" isDisabled={!isCompactDesktop} placement="right">
							<Button
								className={cn('justify-start text-default-500 data-[hover=true]:text-foreground', {
									'justify-center': isCompactDesktop,
								})}
								isIconOnly={isCompactDesktop}
								startContent={
									isCompactDesktop ? null : (
										<Icon
											className="flex-none rotate-180 text-default-500"
											icon="solar:minus-circle-line-duotone"
											width={24}
										/>
									)
								}
								variant="light"
							>
								{isCompactDesktop ? (
									<Icon
										className="rotate-180 text-default-500"
										icon="solar:minus-circle-line-duotone"
										width={24}
									/>
								) : (
									'Log Out'
								)}
							</Button>
						</Tooltip>
					</div>
				</div>
			</SidebarDrawer>
			<div className="w-full flex-1 flex-col p-4">
				<header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
					<Button isIconOnly size="sm" variant="light" onPress={onOpenChange}>
						<Icon
							className="text-default-500"
							height={24}
							icon={isMobile ? 'solar:hamburger-menu-outline' : 'solar:sidebar-minimalistic-outline'}
							width={24}
						/>
					</Button>
					<h2 className="text-medium font-medium text-default-700">Overview</h2>
				</header>
				<main className="mt-4 h-[calc(100vh_-_108px)] w-full">
					<div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider">
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}

Layout.displayName = 'RootPage'

export default Layout
