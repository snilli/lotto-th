import { Inject } from '@nestjs/common'

import { describe, expect, it, vi } from 'vitest'
import { getFsToken, InjectFs } from './fs-token'

vi.mock('@nestjs/common', () => ({
	Inject: vi.fn(),
}))
const path = 'path'
describe('repository-token', () => {
	describe('getRepositoryToken', () => {
		it('returns correct token', () => {
			const token = getFsToken(path)

			expect(token).toBe('pathFileSystem')
		})
	})

	describe('InjectRepository', () => {
		it('returns correct token', () => {
			InjectFs(path)

			expect(Inject).toBeCalledWith('pathFileSystem')
		})
	})
})
