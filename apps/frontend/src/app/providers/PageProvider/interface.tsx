import type { ReactNode } from 'react'

export interface PageProviderContext {
	isCompactMobile: boolean
	isCompactDesktop: boolean
	isMobile: boolean
	isDesktop: boolean
	onOpenChange: () => void
}

export interface PageProviderProps {
	children: ReactNode
}
