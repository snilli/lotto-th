import type { IconProps as IconifyIconProps } from '@iconify/react/dist/iconify.js'

export interface IconProps extends Omit<IconifyIconProps, 'icon'> {
	size?: string | number
}
