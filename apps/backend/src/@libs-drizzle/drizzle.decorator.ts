import { Inject } from '@nestjs/common'

export const InjectDbTag = (tag: string): ParameterDecorator => Inject(GenDdTag(tag))
export const InjectServiceTag = (tag: string): ParameterDecorator => Inject(GenServiceTag(tag))

export const GenDdTag = (tag: string) => `${tag}-db`
export const GenServiceTag = (tag: string) => `${tag}-service`
