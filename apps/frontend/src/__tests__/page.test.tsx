import Page from '../app/page'
import { render, renderHook } from '@testing-library/react'
import { test } from 'vitest'

test('Page', () => {
	const { result } = renderHook((prop) => Page())
	console.log(result)
	render(<Page />)

	// expect(screen.getByText('Log In')).toBeDefined()
})
