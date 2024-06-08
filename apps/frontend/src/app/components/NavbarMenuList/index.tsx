'use client'

import { Icon } from '@iconify/react'
import {
	Accordion,
	AccordionItem,
	cn,
	Listbox,
	ListboxItem,
	ListboxSection,
	Tooltip,
	type Selection,
} from '@nextui-org/react'
import { forwardRef, Key, useCallback, useState } from 'react'
import { NavbarMenuListItem, NavbarMenuListItemType, NavbarMenuListProps } from './interface'

const NavbarMenuList = forwardRef<HTMLElement, NavbarMenuListProps>(
	(
		{
			items,
			isCompact,
			defaultSelectedKey,
			onSelect,
			hideEndContent,
			sectionClasses: sectionClassesProp = {},
			itemClasses: itemClassesProp = {},
			iconClassName,
			classNames,
			className,
			...props
		},
		ref,
	) => {
		const [selected, setSelected] = useState<Key>(defaultSelectedKey)

		const sectionClasses = {
			...sectionClassesProp,
			base: cn(sectionClassesProp?.base, 'w-full', {
				'p-0 max-w-[44px]': isCompact,
			}),
			group: cn(sectionClassesProp?.group, {
				'flex flex-col gap-1': isCompact,
			}),
			heading: cn(sectionClassesProp?.heading, {
				hidden: isCompact,
			}),
		}

		const itemClasses = {
			...itemClassesProp,
			base: cn(itemClassesProp?.base, {
				'w-11 h-11 gap-0 p-0': isCompact,
			}),
		}
		const renderItem = useCallback(
			(item: NavbarMenuListItem) => {
				const isNestType = item.items && item.items?.length > 0 && item?.type === NavbarMenuListItemType.Nest

				if (isNestType) {
					return renderNestItem(item)
				}

				return (
					<ListboxItem
						{...item}
						key={item.key}
						aria-label={item.key}
						endContent={isCompact || hideEndContent ? null : item.endContent ?? null}
						startContent={
							isCompact ? null : item.icon ? (
								<Icon
									className={cn(
										'text-default-500 group-data-[selected=true]:text-foreground',
										iconClassName,
									)}
									icon={item.icon}
									width={24}
								/>
							) : (
								item.startContent ?? null
							)
						}
						textValue={item.title}
						title={isCompact ? null : item.title}
					>
						{isCompact ? (
							<Tooltip key={item.key} content={item.title} placement="right">
								<div className="flex w-full items-center justify-center">
									{item.icon ? (
										<Icon
											className={cn(
												'text-default-500 group-data-[selected=true]:text-foreground',
												iconClassName,
											)}
											icon={item.icon}
											width={24}
										/>
									) : (
										item.startContent ?? null
									)}
								</div>
							</Tooltip>
						) : null}
					</ListboxItem>
				)
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[isCompact, hideEndContent, iconClassName],
		)

		const renderNestItem = useCallback(
			(item: NavbarMenuListItem) => {
				const isNestType = item.items && item.items?.length > 0 && item?.type === NavbarMenuListItemType.Nest
				if (isNestType) {
					// Is a nest type item , so we need to remove the href
					delete item.href
				}

				return (
					<ListboxItem
						{...item}
						key={item.key}
						classNames={{
							base: cn(
								{
									'h-auto p-0': !isCompact && isNestType,
								},
								{
									'inline-block w-11': isCompact && isNestType,
								},
							),
						}}
						aria-label={item.key}
						endContent={isCompact || isNestType || hideEndContent ? null : item.endContent ?? null}
						startContent={
							isCompact || isNestType ? null : item.icon ? (
								<Icon
									className={cn(
										'text-default-500 group-data-[selected=true]:text-foreground',
										iconClassName,
									)}
									icon={item.icon}
									width={24}
								/>
							) : (
								item.startContent ?? null
							)
						}
						title={isCompact || isNestType ? null : item.title}
					>
						{isCompact ? (
							<Tooltip key={`${item.key}-parent-compact`} content={item.title} placement="right">
								<div className="flex w-full items-center justify-center">
									{item.icon ? (
										<Icon
											className={cn(
												'text-default-500 group-data-[selected=true]:text-foreground',
												iconClassName,
											)}
											icon={item.icon}
											width={24}
										/>
									) : (
										item.startContent ?? null
									)}
								</div>
							</Tooltip>
						) : null}
						{!isCompact && isNestType ? (
							<Accordion key={`${item.key}-parent`} className={'p-0'}>
								<AccordionItem
									aria-label={item.title}
									classNames={{
										heading: 'pr-3',
										trigger: 'p-0',
										content: 'py-0 pl-4',
									}}
									title={
										item.icon ? (
											<div className={'flex h-11 items-center gap-2 px-2 py-1.5'}>
												<Icon
													className={cn(
														'text-default-500 group-data-[selected=true]:text-foreground',
														iconClassName,
													)}
													icon={item.icon}
													width={24}
												/>
												<span className="text-small font-medium text-default-500 group-data-[selected=true]:text-foreground">
													{item.title}
												</span>
											</div>
										) : (
											item.startContent ?? null
										)
									}
								>
									{item.items && item.items?.length > 0 ? (
										<Listbox
											aria-label={`${item.key}-parent`}
											className={'mt-0.5'}
											classNames={{
												list: cn('border-l border-default-200 pl-4'),
											}}
											items={item.items}
											variant="flat"
										>
											{item.items.map(renderItem)}
										</Listbox>
									) : (
										renderItem(item)
									)}
								</AccordionItem>
							</Accordion>
						) : null}
					</ListboxItem>
				)
			},
			[isCompact, hideEndContent, iconClassName, renderItem],
		)

		return (
			<Listbox
				key={isCompact ? 'compact' : 'default'}
				ref={ref}
				hideSelectedIcon
				as="nav"
				className={cn('list-none', className)}
				classNames={{
					...classNames,
					list: cn('items-center', classNames?.list),
				}}
				color="default"
				itemClasses={{
					...itemClasses,
					base: cn(
						'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100',
						itemClasses?.base,
					),
					title: cn(
						'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground',
						itemClasses?.title,
					),
				}}
				items={items}
				selectedKeys={[selected] as unknown as Selection}
				selectionMode="single"
				variant="flat"
				onSelectionChange={(keys) => {
					const key = Array.from(keys)[0]

					setSelected(key as Key)
					onSelect?.(key as string)
				}}
				aria-label={'sidebar'}
				{...props}
			>
				{(item) => {
					if (!item.items?.length) {
						return renderItem(item)
					}
					if (item.type === NavbarMenuListItemType.Nest) {
						return renderNestItem(item)
					}

					return (
						<ListboxSection
							key={item.key}
							classNames={sectionClasses}
							showDivider={isCompact}
							title={item.title}
						>
							{item.items.map(renderItem)}
						</ListboxSection>
					)
				}}
			</Listbox>
		)
	},
)

NavbarMenuList.displayName = 'SidebarMenuList'

export default NavbarMenuList
