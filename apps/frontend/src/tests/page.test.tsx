import Page from '@app/c/page'
import { renderHook } from '@testing-library/react'
import { test } from 'vitest'

test('Page', () => {
	const { result } = renderHook((prop) => Page())
	console.log(result)
	// render(<Page />)
	// expect(screen.getByText('Log In')).toBeDefined()
})
