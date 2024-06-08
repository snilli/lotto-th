'use client'
import { useDisclosure } from '@nextui-org/react'
import { createContext, useContext, useMemo } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { PageProviderContext, PageProviderProps } from './interface'

export const PageContext = createContext<PageProviderContext | null>(null)

export function usePage() {
	const ctx = useContext(PageContext)
	if (!ctx) {
		throw new Error('app: PageProvider was not found in component tree, make sure you have it in your app')
	}

	return ctx
}

export function PageProvider({ children }: Readonly<PageProviderProps>) {
	const { isOpen, onOpenChange } = useDisclosure()
	const isMobile = useMediaQuery('(max-width: 768px)')
	const isDesktop = !isMobile
	const isCompactMobile = isOpen && isMobile
	const isCompactDesktop = isOpen && isDesktop

	const contextValue = useMemo(
		() => ({
			isDesktop,
			isMobile,
			isCompactDesktop,
			isCompactMobile,
			isOpen,
			onOpenChange,
		}),
		[isDesktop, isMobile, isCompactDesktop, isCompactMobile, isOpen, onOpenChange],
	)

	return <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
}

PageProvider.displayName = 'PageProvider'
