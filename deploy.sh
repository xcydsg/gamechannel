#!/bin/bash

# 部署脚本
echo "开始部署 GameChannel 项目..."

# 1. 安装依赖
echo "安装依赖..."
npm install

# 2. 构建项目
echo "构建项目..."
npm run build

# 3. 检查构建结果
if [ -d "dist" ]; then
    echo "构建成功！"
else
    echo "构建失败！"
    exit 1
fi

# 4. 启动服务
echo "启动服务..."
npm install -g serve
serve -s dist -l 3000 