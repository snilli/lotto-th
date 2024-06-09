import { Inject } from '@nestjs/common'

export const InjectDbTag = (tag: string): ParameterDecorator => Inject(tag)
