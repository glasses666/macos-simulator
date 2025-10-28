# macOS 26 Simulator

一个功能完整的 macOS 26 模拟器，基于 Web 技术构建，支持打包为桌面应用程序。

## 功能特性

### 核心系统
- ✅ macOS 风格的桌面环境（Dock、菜单栏、桌面壁纸）
- ✅ 完整的窗口管理系统（拖拽、最小化、最大化、关闭）
- ✅ 开机引导界面（Apple logo 启动动画）
- ✅ 深色/浅色主题切换
- ✅ 毛玻璃效果和流畅动画

### 内置应用程序

#### 生产力工具
- **Finder** - 文件管理器，支持文件浏览和管理
- **Terminal** - 终端应用，支持 SSH 连接到远程服务器
- **Calculator** - 计算器，支持基本和科学计算
- **Calendar** - 日历应用
- **Notes** - 备忘录应用

#### 网络和通信
- **Safari** - 浏览器，支持浏览真实网络
- **Photos** - 照片应用，支持上传和管理照片

#### 开发工具
- **Docker** - Docker 管理器，支持真实运行和管理容器
  - 查看容器和镜像列表
  - 启动/停止/删除容器
  - 拉取镜像
  - 运行新容器
  - 查看容器日志

- **Virtual Machine** - 虚拟机管理器
  - 支持 Windows 11、Ubuntu 22.04、macOS Ventura
  - 虚拟机启动/停止/重启

#### 系统工具
- **Settings** - 系统设置

## 技术栈

### 前端
- React 19
- TypeScript
- Tailwind CSS 4
- Wouter (路由)
- shadcn/ui (UI 组件)
- Framer Motion (动画)

### 后端
- Node.js
- Express
- tRPC (类型安全的 API)
- Drizzle ORM (数据库)
- MySQL/TiDB

### 桌面应用
- Electron
- Electron Builder (打包)

### 基础设施
- Docker (容器管理)
- SSH2 (SSH 连接)
- GitHub Actions (CI/CD)

## 快速开始

### 前置要求

- Node.js 22+
- pnpm 10+
- MySQL/TiDB 数据库（可选）

### 安装依赖

```bash
pnpm install
```

### 开发模式

#### Web 应用模式

```bash
pnpm dev
```

访问 http://localhost:3000

#### Electron 桌面应用模式

```bash
pnpm electron:dev
```

### 构建和打包

#### 构建 Web 应用

```bash
pnpm build
```

#### 打包为桌面应用

```bash
pnpm electron:build
```

生成的安装包位于 `release/` 目录。

## 使用 GitHub Actions 自动构建

本项目配置了 GitHub Actions，可以自动构建 Windows、macOS 和 Linux 三个平台的安装包。

### 触发构建

创建并推送版本标签：

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 会自动构建并创建 Release，包含所有平台的安装包。

详细说明请查看 [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)

## 项目结构

```
macos-simulator/
├── client/                 # 前端代码
│   ├── public/            # 静态资源
│   └── src/
│       ├── apps/          # 应用程序组件
│       ├── components/    # UI 组件
│       ├── contexts/      # React 上下文
│       ├── hooks/         # 自定义 Hooks
│       └── pages/         # 页面组件
├── server/                # 后端代码
│   ├── _core/            # 核心服务
│   ├── docker.ts         # Docker 服务
│   ├── ssh.ts            # SSH 服务
│   └── routers.ts        # tRPC 路由
├── electron/              # Electron 主进程
│   ├── main.js           # 主进程入口
│   └── preload.js        # 预加载脚本
├── drizzle/              # 数据库 Schema
└── .github/
    └── workflows/        # GitHub Actions 配置
```

## 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 数据库
DATABASE_URL=mysql://user:password@localhost:3306/macos_simulator

# JWT
JWT_SECRET=your-secret-key

# OAuth（如果使用）
OAUTH_SERVER_URL=https://your-oauth-server.com
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com

# 其他配置
VITE_APP_TITLE=macOS 26 Simulator
VITE_APP_LOGO=/logo.png
```

## 数据库迁移

```bash
pnpm db:push
```

## 文档

- [Electron 打包说明](./ELECTRON_BUILD.md)
- [GitHub Actions 使用指南](./GITHUB_ACTIONS.md)

## 系统要求

### Web 应用
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 建议分辨率：1280x800 或更高

### 桌面应用
- **Windows**: Windows 10 或更高版本
- **macOS**: macOS 10.13 或更高版本
- **Linux**: 支持 AppImage 的发行版

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

- 设计灵感来自 macOS
- UI 组件基于 shadcn/ui
- 图标来自 Lucide Icons
