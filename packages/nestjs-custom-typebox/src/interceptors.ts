import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { DECORATORS } from '@nestjs/swagger/dist/constants.js'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { isSchemaValidator } from './decorators.js'
import { Obj, ResponseSchema } from './types.js'

@Injectable()
export class TypeboxTransformInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			map((data: Obj) => {
				const responseMeta = this.reflector.get<Record<string, ResponseSchema>>(
					DECORATORS.API_RESPONSE,
					context.getHandler(),
				)

				const validator = (responseMeta['200'] || responseMeta['201'])?.type
				const res = {
					statusCode: 200,
					message: 'Success',
					data,
				}
				if (!isSchemaValidator(validator)) {
					return res
				}

				return validator.validate(res)
			}),
			catchError((err: unknown) => throwError(() => err)),
		)
	}
}
