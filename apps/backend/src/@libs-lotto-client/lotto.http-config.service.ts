import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { HttpsAgent } from 'agentkeepalive'

@Injectable()
export class LottoHttpConfigService implements HttpModuleOptionsFactory {
	createHttpOptions(): HttpModuleOptions {
		return {
			baseURL: 'https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/',
			httpAgent: new HttpsAgent({ keepAlive: true }),
			httpsAgent: new HttpsAgent({ keepAlive: true }),
			timeout: 5000,
		}
	}
}
