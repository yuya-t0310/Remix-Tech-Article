# 環境構築
```shellscript
# Node.js, Postgresql116をインストールしておくこと

npm install

# 以下使用ライブラリ コマンド実行は不要

# prisma
npx prisma
npx prisma init
npx prisma migrate dev --name init

# tailwindcss
npm i --save-dev @tailwindcss/typography
npm add @egoist/tailwindcss-icons
npm add -D @iconify/json
npm i -D @iconify-json/iconoir   

# invariant
npm i tiny-invariant

# bycript
npm i bcryptjs
npm i -D @types/bcryptjs

# markdown
npm install react-markdown
npm install remark-gfm
npm install rehype-raw
npm i --save-dev @types/markdown-it
```

# 予定機能
  * 記事の作成・閲覧・編集・削除
    - Markdownに対応したい
    - タグをつけてタグ検索できるようにしたい
    - 作成したユーザのみが編集・削除できるようにしたい
  * ログイン機能
    - サインアップ
    - ログイン状態による各画面の操作可否

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
