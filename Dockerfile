# /usr/src/nodejs/hello-docker/Dockerfile
FROM node:20.9.0

# 在容器中创建一个目录
RUN mkdir -p /app/

# 定位到容器的工作目录
WORKDIR /app/

# RUN/COPY 是分层的，package.json 提前，只要没修改，就不会重新安装包
COPY package.json /app/package.json
RUN cd /app/
RUN npm i

# 把当前目录下的所有文件拷贝到 Image 的 /usr/src/nodejs/ 目录下
COPY . /app/


EXPOSE 3000
CMD npm start
