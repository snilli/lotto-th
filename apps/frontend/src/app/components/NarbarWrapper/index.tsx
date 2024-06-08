'use client'

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarContent,
	NavbarItem,
	ScrollShadow,
} from '@nextui-org/react'
import Link from 'next/link'

const NavbarWrapper = () => {
	return (
		<Navbar
			classNames={{ base: 'bg-primary', item: 'data-[active=true]:text-default' }}
			maxWidth="full"
			className="px-2 lg:px-24"
		>
			<ScrollShadow orientation="horizontal" className="w-full h-full justify-center">
				<NavbarContent className="w-full sm:flex gap-4" justify="center">
					<Dropdown type="listbox">
						<NavbarItem>
							<DropdownTrigger>
								<Button
									disableRipple
									className="p-0 bg-transparent data-[hover=true]:bg-transparent"
									radius="sm"
									variant="light"
								>
									Features
								</Button>
							</DropdownTrigger>
						</NavbarItem>
						<DropdownMenu
							aria-label="ACME features"
							className="w-[340px]"
							itemClasses={{
								base: 'gap-4',
							}}
						>
							<DropdownItem
								key="autoscaling"
								description="ACME scales apps to meet user demand, automagically, based on load."
							>
								Autoscaling
							</DropdownItem>
							<DropdownItem
								key="usage_metrics"
								description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
							>
								Usage Metrics
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<Dropdown>
						<NavbarItem>
							<DropdownTrigger>
								<Button
									disableRipple
									className="p-0 bg-transparent data-[hover=true]:bg-transparent"
									radius="sm"
									variant="light"
								>
									Features
								</Button>
							</DropdownTrigger>
						</NavbarItem>
						<DropdownMenu
							aria-label="ACME features"
							className="w-[340px]"
							itemClasses={{
								base: 'gap-4',
							}}
						>
							<DropdownItem
								key="autoscaling"
								description="ACME scales apps to meet user demand, automagically, based on load."
							>
								Autoscaling
							</DropdownItem>
							<DropdownItem
								key="usage_metrics"
								description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
							>
								Usage Metrics
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<NavbarItem isActive>
						<Link aria-current="page" className="flex gap-2 text-inherit" href="#">
							Deployments
						</Link>
					</NavbarItem>

					<NavbarItem>
						<Link className="flex gap-2 text-inherit" href="#">
							Team
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link className="flex gap-2 text-inherit" href="#">
							Settings
						</Link>
					</NavbarItem>
				</NavbarContent>
			</ScrollShadow>
		</Navbar>
	)
}

NavbarWrapper.displayName = 'NavbarWrapper'

export default NavbarWrapper
