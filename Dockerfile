FROM node:18.15.0-alpine3.17

WORKDIR /app

COPY package.json package-lock.json ./

# 设置环境变量
ENV NODE_OPTIONS=--openssl-legacy-provider

# 安装依赖
RUN npm config set registry https://registry.npmmirror.com -g && npm install --no-cache

# 拷贝项目目录进来
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]
