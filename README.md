# 環境構築
```shellscript
npx create-remix@latest

mkdir my-remix-app
cd my-remix-app
npm init -y
 
# ランタイム依存関係をインストール
npm i @remix-run/node @remix-run/react @remix-run/serve isbot@4 react react-dom
 
# 開発依存関係をインストール
npm i -D @remix-run/dev vite

npm i express @remix-run/express cross-env

node server.js
node --inspect server.js

npm install

# prisma
npx prisma
npx prisma init
npx prisma migrate dev --name add_article_model

# invariant
npm i tiny-invariant
```

# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
