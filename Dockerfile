# 使用内部源
FROM harbor.nykjsrv.com/library/node:18.17-slim
WORKDIR /app/template-server
# 少一个命令，少一个层，速度会更快 \ 标识换行
ENV TZ=Asia/Shanghai \
    PORT=80
COPY . .

EXPOSE 80

CMD node dist/src/main.js
