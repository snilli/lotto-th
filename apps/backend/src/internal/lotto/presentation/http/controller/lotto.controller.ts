import { LottoAggregate } from '@app/internal/lotto/domain/entity/lotto.aggregate.js'
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { ZodSerializerDto } from 'nestjs-zod'
import { LottoService } from '../../../application/service/lotto.service.js'
import {
	CheckGlobalLottoPrizeBody,
	CheckGlobalLottoPrizeParam,
	CheckGlobalLottoPrizeResponse,
} from '../dto/check-global-lotto-prize.dto.js'
import {
	CheckLocalLottoPrizeBody,
	CheckLocalLottoPrizeParam,
	CheckLocalLottoPrizeResponse,
} from '../dto/check-local-lotto-prize.dto.js'
import { LottoModel, LottoModelDTO } from '../dto/lotto.model.js'

@Controller('lotto')
export class LottoController {
	constructor(private readonly lottaService: LottoService) {}

	// @Get('/pages')
	// @ZodSerializerDto(LottoModelDTO)
	// @ApiOkResponse({ type: LottoModelDTO })
	// async getAll() {
	// 	return await this.lottoClientService.getAll()
	// }

	@Get('/current')
	@ZodSerializerDto(LottoModelDTO)
	@ApiOkResponse({ type: LottoModelDTO })
	async getCurrent() {
		const res = await this.lottaService.getCurrent()
		return this.mapAggregateToModel(res)
	}

	@Post('/check/global/:date')
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'date', type: 'string', description: 'Lotto weekly date' })
	@ApiBody({ type: CheckGlobalLottoPrizeBody })
	@ApiOkResponse({ type: [CheckGlobalLottoPrizeResponse] })
	@ZodSerializerDto(CheckGlobalLottoPrizeResponse)
	async checkGlobalPrize(@Param() params: CheckGlobalLottoPrizeParam, @Body() payload: CheckGlobalLottoPrizeBody) {
		return await this.lottaService.checkGlobalPrize(params.date, payload.numbers)
	}

	@Post('/check/local/:date')
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'date', type: 'string', description: 'Lotto weekly date' })
	@ApiBody({ type: CheckLocalLottoPrizeBody })
	@ApiOkResponse({ type: [CheckLocalLottoPrizeResponse] })
	@ZodSerializerDto(CheckLocalLottoPrizeResponse)
	async checkLocalPrize(@Param() params: CheckLocalLottoPrizeParam, @Body() payload: CheckLocalLottoPrizeBody) {
		return await this.lottaService.checkLocalPrize(params.date, payload)
	}

	@Get('/ping')
	ping() {
		return 'ok'
	}

	private mapAggregateToModel(agg: LottoAggregate): LottoModel {
		const state = agg.toJson()
		return {
			date: state.id,
			prize1: state.prize1,
			prize2: state.prize2,
			prize3: state.prize3,
			prize4: state.prize4,
			prize5: state.prize5,
			last2Digit: state.last2Digit,
			first3Digit: state.first3Digit,
			last3Digit: state.last3Digit,
		}
	}
}
