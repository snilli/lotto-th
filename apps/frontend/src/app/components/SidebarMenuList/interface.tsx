import { ListboxProps, ListboxSectionProps } from '@nextui-org/react'
import type { ReactNode } from 'react'

export enum SidebarMenuListItemType {
	Nest = 'nest',
}

export type SidebarMenuListItem = {
	key: string
	title: string
	icon?: string
	href?: string
	type?: SidebarMenuListItemType.Nest
	startContent?: ReactNode
	endContent?: ReactNode
	items?: SidebarMenuListItem[]
	className?: string
}

export type SidebarMenuListProps = Omit<ListboxProps<SidebarMenuListItem>, 'children'> & {
	items: SidebarMenuListItem[]
	isCompact?: boolean
	hideEndContent?: boolean
	iconClassName?: string
	sectionClasses?: ListboxSectionProps['classNames']
	classNames?: ListboxProps['classNames']
	defaultSelectedKey: string
	onSelect?: (key: string) => void
}
