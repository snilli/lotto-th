import { Inject } from '@nestjs/common'

export const getFsToken = (path: string): string => `${path}FileSystem`

export const InjectFs = (path: string): ParameterDecorator => Inject(getFsToken(path))
