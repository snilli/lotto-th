const re = new RegExp(/([\w\-])+/g)

export interface Digimon {
	name: string
	ccFrom?: string
	type: string
	ccRef?: string
	ucFrom?: string
	ucRef?: string
	mcFrom?: string
	mcRef?: string
}
const types = ['vac', 'data', 'virus']

const q = {
	rookie: ['ccFrom'],
	champion: ['ccRef', 'ucFrom'],
	ultimate: ['ucRef', 'mcFrom'],
	mega: ['mcRef'],
} as const
export const extractCharactorBase =
	(typeLength: number, type: 'rookie' | 'champion' | 'ultimate' | 'mega') => (raw: string) => {
		const res: Record<string, Digimon> = {}
		for (const line of raw.split('\n')) {
			const cols = line.match(re) as string[]
			if (!cols?.length) {
				continue
			}

			const w = q[type]
			for (let typeIdx = 0; typeIdx < cols.length / typeLength; typeIdx++) {
				const pickedTypeIdx = typeIdx * typeLength
				const t: Digimon = {
					name: cols[pickedTypeIdx],
					type: types[typeIdx],
				}
				for (const [i, e] of w.entries()) {
					t[e] = cols[pickedTypeIdx + i + 1]
				}

				res[cols[pickedTypeIdx + 1]] = t
			}
		}

		return res
	}

export const extractChampionChart = (raw: string, young: Record<string, Digimon>, old: Record<string, Digimon>) => {
	const res: Record<string, any> = {}
	const lines = raw.split('\n')
	let header = lines.shift()!.split('|')
	header = header.slice(2, header.length - 1).map((q) => old[q.trim()].name)

	// for (const line of lines) {
	// 	let cols = line.split('|')
	// 	cols = cols.slice(1, cols.length - 1)
	// 	const hCol = cols.shift()!
	// 	for (const [i, col] of cols.entries()) {
	// 		let q = res[old[hCol].name]
	// 		if (!q) {
	// 			q = []
	// 			res[old[hCol].name] = q
	// 		}
	// 		q.push(young[col].name)
	// 	}
	// }

	console.log({ content: res, header })
}
