import { ListboxProps, ListboxSectionProps } from '@nextui-org/react'
import type { ReactNode } from 'react'

export enum NavbarMenuListItemType {
	Nest = 'nest',
}

export type NavbarMenuListItem = {
	key: string
	title: string
	icon?: string
	href?: string
	type?: NavbarMenuListItemType.Nest
	startContent?: ReactNode
	endContent?: ReactNode
	items?: NavbarMenuListItem[]
	className?: string
}

export type NavbarMenuListProps = Omit<ListboxProps<NavbarMenuListItem>, 'children'> & {
	items: NavbarMenuListItem[]
	isCompact?: boolean
	hideEndContent?: boolean
	iconClassName?: string
	sectionClasses?: ListboxSectionProps['classNames']
	classNames?: ListboxProps['classNames']
	defaultSelectedKey: string
	onSelect?: (key: string) => void
}
