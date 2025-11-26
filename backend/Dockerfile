# Development Dockerfile for NestJS
FROM node:20-alpine

WORKDIR /app

# ネイティブモジュール用のツールを入れる（root権限が必要なので最初にやる）
RUN apk add --no-cache python3 make g++

# 作業ディレクトリの所有権を 'node' ユーザーに変更する
RUN chown -R node:node /app

# ここから先は 'node' ユーザー (UID 1000) として実行する
USER node

# ファイルをコピーする際も所有者を指定する
COPY --chown=node:node package*.json ./

# パッケージインストール
RUN npm install

# ソースコードをコピー
COPY --chown=node:node . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]