#!/bin/bash
import { CommandFactory } from 'nest-commander'
import { AppCliModule } from './app-cli.module'

async function bootstrap() {
	await CommandFactory.run(AppCliModule)
}

bootstrap()
