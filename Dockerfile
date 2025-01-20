# 使用内部源
FROM harbor.nykjsrv.com/library/node:18.17-slim

WORKDIR /app/template-server

COPY . .

# 少一个命令，少一个层，速度会更快 \ 标识换行
ENV TZ=Asia/Shanghai \
    PORT=80

RUN npm config set registry https://registry.npmmirror.com && \
  sed -i 's/deb.debian.org/mirrors.huaweicloud.com/g' /etc/apt/sources.list.d/debian.sources && \
  npm install -g pnpm && \
  pnpm install && \
  pnpm run build && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# 拷贝打包后产物
COPY . .

# ORM客户端
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && npx prisma generate

EXPOSE 80

CMD ["node", "dist/main.js"]
