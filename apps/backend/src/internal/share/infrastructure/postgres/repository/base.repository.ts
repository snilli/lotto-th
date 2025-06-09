import { BaseAggregate } from '@app/internal/share/domain/base.aggregate.js'

export abstract class BaseRepository<T extends BaseAggregate, E extends Record<string, any>> {
	abstract mapAggregateToModel(agg: T): E
	abstract mapModelToAggregate(model: E): T
}
