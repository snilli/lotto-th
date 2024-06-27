import { iam, lambda } from '@pulumi/aws'
import { ecr } from '@pulumi/awsx'
import { getRefOutput } from '@pulumi/github/getRef'

const lottoTag = {
	name: 'lottoService',
	type: 'api',
	runtime: 'node.js',
}
const development = getRefOutput({
	owner: 'example',
	repository: 'example',
	ref: 'heads/development',
})

const repo = new ecr.Repository('lotto-service', {
	forceDelete: true,
	tags: lottoTag,
})

const image = new ecr.Image('image', {
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
	packageType: 'Image',
	imageUri: image.imageUri,
	role: role.arn,
	timeout: 900,
	tags: lottoTag,
})

export { iam, image, lottoApi }
