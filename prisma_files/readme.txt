npm install
↓
npx prisma migrate dev --name init
実行時に以下のエラーが発生した場合はnode_modules配下の@prismaとprismaフォルダを
このディレクトリ内のものに置き換えてください。

> Downloading Prisma engines for Node-API for windows [                    ] 0%Error: request to https://binaries.prisma.sh/all_commits/173f8d54f8d52e692c7e27e72a88314ec7aeff60/windows/query_engine.dll.node.gz.sha256 failed, reason: