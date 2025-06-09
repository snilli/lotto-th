export abstract class BaseAggregate<T = unknown> {
	abstract toJson(): T
}
