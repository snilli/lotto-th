'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'
export function AppProvider(props: AppProviderProps) {
	const { children, className } = props

	return (
		<NextUIProvider className={className} validationBehavior="native">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				{children}
			</NextThemesProvider>
		</NextUIProvider>
	)
}

interface AppProviderProps {
	children: ReactNode
	className?: string
}
