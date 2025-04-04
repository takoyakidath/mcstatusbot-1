# ベースイメージとして公式の Node.js イメージを使用
FROM node:20-bullseye

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install --production

# アプリケーションコードをコピー
COPY . .


# ポートを公開（必要に応じて変更）
EXPOSE 3000

# 環境変数を設定（必要に応じて変更）
ENV NODE_ENV=production

# アプリケーションを起動
CMD ["npm", "start"]