FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY scripts/ ./scripts/
COPY artifacts/api-server/ ./artifacts/api-server/

RUN pnpm install

RUN pnpm --filter @workspace/api-server run build

ENV PORT=3000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
