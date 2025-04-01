import { render, renderHook } from '@testing-library/react'
import { test } from 'vitest'
import Page from '../app/page'

test('Page', () => {
	const { result } = renderHook(() => Page())
	console.log(result)
	render(<Page />)
	// expect(screen.getByText('Log In')).toBeDefined()
})
