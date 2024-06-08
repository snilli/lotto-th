'use client'

import type { RadioProps } from '@nextui-org/react'

import { Icon } from '@iconify/react'
import { VisuallyHidden, cn, useRadio, useRadioGroupContext } from '@nextui-org/react'

export const ThemeRadioItem = ({ icon, ...props }: RadioProps & { icon: string }) => {
	const { Component, isSelected: isSelfSelected, getBaseProps, getInputProps, getWrapperProps } = useRadio(props)

	const groupContext = useRadioGroupContext()

	const isSelected = isSelfSelected || Number(groupContext.groupState.selectedValue) >= Number(props.value)

	const wrapperProps = getWrapperProps()

	return (
		<Component {...getBaseProps()}>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<div
				{...wrapperProps}
				className={cn(
					wrapperProps?.['className'],
					'pointer-events-none h-8 w-8 rounded-full border-black border-opacity-10 ring-0 transition-transform group-data-[pressed=true]:scale-90',
					{
						'bg-default-200 dark:bg-default-100': isSelected,
					},
				)}
			>
				<Icon className="text-default-500" icon={icon} width={18} />
			</div>
		</Component>
	)
}

export default ThemeRadioItem
