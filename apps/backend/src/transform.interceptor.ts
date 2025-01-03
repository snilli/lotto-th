import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				return {
					statusCode: 200,
					message: 'Success',
					data,
				}
			}),
			catchError((err) => throwError(() => err)),
		)
	}
}
