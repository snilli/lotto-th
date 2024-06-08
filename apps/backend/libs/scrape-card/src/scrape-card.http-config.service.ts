import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { HttpsAgent } from 'agentkeepalive'

@Injectable()
export class ScrapeCardHttpConfigService implements HttpModuleOptionsFactory {
	createHttpOptions(): HttpModuleOptions {
		return {
			baseURL: 'https://gamefaqs.gamespot.com',
			httpAgent: new HttpsAgent({ keepAlive: true }),
			httpsAgent: new HttpsAgent({ keepAlive: true }),
			timeout: 5000,
		}
	}
}
