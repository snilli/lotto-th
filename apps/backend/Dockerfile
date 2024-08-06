FROM public.ecr.aws/lambda/nodejs:20-arm64 AS node
WORKDIR ${LAMBDA_TASK_ROOT}

FROM node AS base
ENV PNPM_HOME /pnpm
ENV CI true
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

FROM base AS builder
COPY . .
RUN turbo prune --scope=lotto-api --docker

FROM base AS installer
RUN dnf install -y make g++ python3
COPY .gitignore .gitignore
COPY --from=builder ${LAMBDA_TASK_ROOT}/out/json/ .
COPY --from=builder ${LAMBDA_TASK_ROOT}/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder ${LAMBDA_TASK_ROOT}/out/full/ .
RUN pnpm install --frozen-lockfile
RUN turbo run build --filter=lotto-api
RUN pnpm prune --prod
RUN pnpm install --prod --frozen-lockfile

FROM node AS runner
ENV NODE_ENV=production

COPY --from=installer ${LAMBDA_TASK_ROOT}/apps/backend/dist ./apps/backend/dist
COPY --from=installer ${LAMBDA_TASK_ROOT}/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=installer ${LAMBDA_TASK_ROOT}/apps/backend/package.json ./apps/backend/package.json

COPY --from=installer ${LAMBDA_TASK_ROOT}/package.json ./package.json
COPY --from=installer ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=installer ${LAMBDA_TASK_ROOT}/turbo.json ./turbo.json

CMD ["apps/backend/dist/main.handler"]