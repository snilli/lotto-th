import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export interface RangeFromTo {
	from: number
	to: number
}

@Injectable()
export class TimeService {
	toRFC3339(timestamp: number, omitTime = false): string {
		const date = new Date(timestamp * 1000)

		if (omitTime) {
			return (
				date.getUTCFullYear().toString() +
				'-' +
				this.pad(date.getUTCMonth() + 1) +
				'-' +
				this.pad(date.getUTCDate())
			)
		}

		return (
			date.getUTCFullYear().toString() +
			'-' +
			this.pad(date.getUTCMonth() + 1) +
			'-' +
			this.pad(date.getUTCDate()) +
			'T' +
			this.pad(date.getUTCHours()) +
			':' +
			this.pad(date.getUTCMinutes()) +
			':' +
			this.pad(date.getUTCSeconds()) +
			'Z'
		)
	}

	format(timestamp: number, formatStr: string | undefined = undefined, timezone = 0): string {
		if (timezone === 0) {
			return dayjs.utc(timestamp * 1000).format(formatStr)
		}

		return dayjs
			.utc(timestamp * 1000)
			.utcOffset(timezone)
			.format(formatStr)
	}

	parse(dateTime: string, format: string | undefined = undefined): number {
		const date = dayjs(dateTime, format)
		if (!date.isValid()) {
			throw new Error('Invalid date time format')
		}

		return date.utc().unix()
	}

	freeze(timestamp: number): void {
		this.freezeDate = timestamp
	}

	new(date?: string): number {
		if (this.freezeDate) {
			return this.freezeDate
		}

		if (date) {
			return Math.round(Date.parse(date) / 1000)
		}

		return Math.round(Date.now() / 1000)
	}

	diffDate(beforeTs: number, afterTs: number): number {
		return afterTs - beforeTs
	}

	diffDateIn(
		beforeTs: number,
		afterTs: number,
		type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
	): number {
		return dayjs.utc(afterTs * 1000).diff(dayjs.utc(beforeTs * 1000), type)
	}

	add(timestamp: number, duration: number, type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): number {
		return dayjs
			.utc(timestamp * 1000)
			.add(duration, type)
			.unix()
	}

	sub(timestamp: number, duration: number, type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): number {
		return dayjs
			.utc(timestamp * 1000)
			.subtract(duration, type)
			.unix()
	}

	set(
		timestamp: number,
		duration: number,
		type: 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second',
		offset = 0,
	): number {
		if (type === 'month') {
			return dayjs
				.utc(timestamp * 1000)
				.utcOffset(offset)
				.set(type, duration - 1)
				.unix()
		}

		return dayjs
			.utc(timestamp * 1000)
			.utcOffset(offset)
			.set(type, duration)
			.unix()
	}

	get(timestamp: number, type: 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', offset = 0): number {
		if (type === 'month') {
			return (
				dayjs
					.utc(timestamp * 1000)
					.utcOffset(offset)
					.get(type) + 1
			)
		}

		return dayjs
			.utc(timestamp * 1000)
			.utcOffset(offset)
			.get(type)
	}

	startOf(timestamp: number, type: 'day' | 'month' | 'week' | 'year', offset: number): number {
		return dayjs
			.utc(timestamp * 1000)
			.utcOffset(offset)
			.startOf(type)
			.unix()
	}

	endOf(timestamp: number, type: 'day' | 'month' | 'week' | 'year', offset: number): number {
		return dayjs
			.utc(timestamp * 1000)
			.utcOffset(offset)
			.endOf(type)
			.unix()
	}

	splitTime(start: number, to: number, range: number, type: 'day' | 'hr' | 'min' | 'sec'): RangeFromTo[] {
		const diffSec = this.diffDate(start, to)

		const secType = this.getSecFromType(type)
		const rangeSec = secType * range

		if (diffSec <= rangeSec) {
			return [
				{
					from: start,
					to: to,
				},
			]
		}

		const count = Math.ceil(diffSec / rangeSec)

		const result: RangeFromTo[] = []

		let lastTo = to
		for (let i = 1; i <= count; i++) {
			const from = to - rangeSec * i
			result.push({
				from: from,
				to: lastTo,
			})

			lastTo = from
		}
		result[result.length - 1].from = start

		return result
	}

	unfreeze(): void {
		this.freezeDate = undefined
	}

	private freezeDate: number | undefined

	private getSecFromType(type: 'day' | 'hr' | 'min' | 'sec'): number {
		switch (type) {
			case 'day':
				return 86400
			case 'hr':
				return 3600
			case 'min':
				return 60
			case 'sec':
				return 1
		}
	}

	private pad(n: number): string {
		if (n < 10) {
			return '0' + n.toString()
		}

		return n.toString()
	}
}
