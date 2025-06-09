import { LottoAggregate } from '../entity/lotto.aggregate'
import { CheckGlobalPrizeResponse, CheckLocalPrizeInput, CheckLocalPrizeResponse } from './interface/lotto.repository'

export abstract class LottoRepository {
	abstract getById(id: string): Promise<LottoAggregate | undefined>
	abstract getAllById(ids: string[]): Promise<LottoAggregate[]>
	abstract create(agg: LottoAggregate): Promise<LottoAggregate>
	abstract batchCreate(aggs: LottoAggregate[]): Promise<LottoAggregate[]>
	abstract checkGlobalPrize(date: string, lottos: string[]): Promise<CheckGlobalPrizeResponse[]>
	abstract checkLocalPrize(date: string, inputs: CheckLocalPrizeInput[]): Promise<CheckLocalPrizeResponse[]>
}
