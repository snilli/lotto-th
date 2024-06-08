'use client'

import type { RadioGroupProps } from '@nextui-org/react'

import { RadioGroup, cn } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { forwardRef } from 'react'

const DynamicThemeRadioItem = dynamic(() => import('./ThemeRadioItem').then((mod) => mod.ThemeRadioItem))

const ThemeSwitch = forwardRef<HTMLDivElement, Omit<RadioGroupProps, 'children'>>(
	({ classNames = {}, ...props }, ref) => {
		const { setTheme, theme } = useTheme()
		return (
			<RadioGroup
				ref={ref}
				aria-label="Select a theme"
				classNames={{
					...classNames,
					wrapper: cn('gap-0 items-center', classNames?.wrapper),
				}}
				orientation="horizontal"
				value={theme}
				{...props}
			>
				<DynamicThemeRadioItem onClick={() => setTheme('dark')} icon="solar:moon-linear" value="dark" />
				<DynamicThemeRadioItem onClick={() => setTheme('light')} icon="solar:sun-2-linear" value="light" />
			</RadioGroup>
		)
	},
)

ThemeSwitch.displayName = 'ThemeSwitch'

export default ThemeSwitch
