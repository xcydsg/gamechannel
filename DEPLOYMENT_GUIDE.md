# 项目部署指南

## 部署方式选择

### 1. 静态网站托管（推荐新手）

#### Vercel 部署（最简单）
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 构建项目
npm run build

# 3. 部署
vercel --prod
```

**优点：**
- 免费
- 自动 HTTPS
- 全球 CDN
- 自动部署

#### Netlify 部署
```bash
# 1. 构建项目
npm run build

# 2. 将 dist 文件夹拖拽到 Netlify 网站
# 或者使用 CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages 部署
```bash
# 1. 安装 gh-pages
npm install --save-dev gh-pages

# 2. 在 package.json 中添加脚本
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# 3. 部署
npm run deploy
```

### 2. 云服务器部署

#### 使用 Docker（推荐）
```bash
# 1. 构建 Docker 镜像
docker build -t gamechannel-app .

# 2. 运行容器
docker run -p 3000:3000 gamechannel-app

# 或者使用 docker-compose
docker-compose up -d
```

#### 手动部署到服务器
```bash
# 1. 上传代码到服务器
scp -r . user@your-server:/path/to/app

# 2. 在服务器上运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

## 部署前准备

### 1. 环境配置
- 确保生产环境的 RPC URL 正确
- 更新合约地址（如果部署到不同网络）
- 配置正确的网络参数

### 2. 构建优化
```bash
# 生产环境构建
npm run build

# 检查构建结果
ls -la dist/
```

### 3. 测试部署
```bash
# 本地测试生产构建
npm install -g serve
serve -s dist -l 3000
```

## 部署步骤

### 步骤 1：准备项目
```bash
# 1. 确保代码是最新版本
git pull origin main

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build
```

### 步骤 2：选择部署方式

#### 方式 A：Vercel（推荐）
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel --prod
```

#### 方式 B：Docker
```bash
# 1. 构建镜像
docker build -t gamechannel-app .

# 2. 运行容器
docker run -d -p 3000:3000 --name gamechannel gamechannel-app
```

#### 方式 C：传统服务器
```bash
# 1. 上传文件到服务器
scp -r dist/ user@server:/var/www/gamechannel/

# 2. 配置 Nginx
sudo nano /etc/nginx/sites-available/gamechannel

# 3. 启用站点
sudo ln -s /etc/nginx/sites-available/gamechannel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 域名和 SSL

### 1. 域名配置
- 购买域名（如：gamechannel.com）
- 配置 DNS 解析到服务器 IP

### 2. SSL 证书
```bash
# 使用 Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 监控和维护

### 1. 日志监控
```bash
# 查看应用日志
docker logs gamechannel-app

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
```

### 2. 性能监控
- 使用 Google Analytics
- 配置错误监控（如 Sentry）
- 设置性能监控

### 3. 备份策略
```bash
# 备份应用文件
tar -czf backup-$(date +%Y%m%d).tar.gz dist/

# 备份数据库（如果有）
mysqldump -u username -p database > backup.sql
```

## 常见问题

### 1. 构建失败
```bash
# 检查 Node.js 版本
node --version

# 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. 部署后无法访问
- 检查防火墙设置
- 确认端口是否正确开放
- 检查域名解析是否正确

### 3. 性能问题
- 启用 Gzip 压缩
- 配置 CDN
- 优化图片和资源

## 安全注意事项

1. **环境变量**：不要将敏感信息提交到代码库
2. **HTTPS**：确保使用 HTTPS 协议
3. **更新**：定期更新依赖包
4. **监控**：设置安全监控和告警

## 成本估算

### 免费方案
- Vercel/Netlify：免费
- GitHub Pages：免费
- 域名：约 $10-15/年

### 付费方案
- VPS 服务器：$5-20/月
- 域名：$10-15/年
- SSL 证书：免费（Let's Encrypt）

## 推荐部署流程

1. **开发阶段**：使用 Vercel 进行快速部署和测试
2. **生产阶段**：使用 Docker + 云服务器进行正式部署
3. **监控阶段**：配置监控和告警系统 