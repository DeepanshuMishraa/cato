FROM node:20.19-alpine3.21

WORKDIR /src

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN rm -rf /src/.git /src/.vscode /src/.env /src/*.log

EXPOSE 3000

CMD ["pnpm", "dev"]
