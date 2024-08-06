import { iam, lambda } from '@pulumi/aws'
import { lambda as lambdax } from '@pulumi/aws-native'
import { ecr } from '@pulumi/awsx'
import { getRefOutput } from '@pulumi/github/getRef'

const lottoTag = {
	name: 'lottoService',
	type: 'api',
	runtime: 'node.js',
}
const development = getRefOutput({
	owner: 'snilli',
	repository: 'lotto-th',
	ref: 'heads/main',
})

const repo = new ecr.Repository('lotto-service', {
	forceDelete: true,
	tags: lottoTag,
})

const image = new ecr.Image('image', {
	platform: 'linux/arm64',
	repositoryUrl: repo.url,
	context: '.',
	dockerfile: './apps/backend/Dockerfile',
	imageName: 'lotto-service',
	imageTag: development.sha,
})

const role = new iam.Role('thumbnailerRole', {
	assumeRolePolicy: iam.assumeRolePolicyForPrincipal({ Service: 'lambda.amazonaws.com' }),
})

new iam.RolePolicyAttachment('lambdaFullAccess', {
	role: role.name,
	policyArn: iam.ManagedPolicy.AWSLambdaExecute,
})

const lottoApi = new lambda.Function('lotto-api', {
	loggingConfig: {
		logFormat: 'JSON',
	},
	tracingConfig: {
		mode: lambdax.FunctionTracingConfigMode.Active,
	},
	architectures: ['arm64'],
	packageType: 'Image',
	imageUri: image.imageUri,
	memorySize: 1024,
	role: role.arn,
	timeout: 900,
	tags: lottoTag,
})

export { iam, image, lottoApi }
