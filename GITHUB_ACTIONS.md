# GitHub Actions 自动构建说明

本项目已配置 GitHub Actions，可以自动构建 Windows、macOS 和 Linux 三个平台的安装包。

## 使用步骤

### 1. 推送代码到 GitHub

首先，将项目推送到您的 GitHub 仓库：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/macos-simulator.git

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit with Electron build support"

# 推送到 GitHub
git push -u origin main
```

### 2. 触发构建

有两种方式触发自动构建：

#### 方式 1: 创建版本标签（推荐）

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签到 GitHub
git push origin v1.0.0
```

这将触发构建，并自动创建 GitHub Release，包含所有平台的安装包。

#### 方式 2: 手动触发

1. 进入 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Build and Release" 工作流
4. 点击 "Run workflow" 按钮
5. 选择分支并运行

手动触发的构建会生成安装包作为 Artifacts，但不会创建 Release。

### 3. 下载构建产物

#### 从 GitHub Release 下载（标签触发）

1. 进入仓库的 "Releases" 页面
2. 找到对应的版本
3. 下载需要的安装包：
   - `macOS 26 Simulator Setup.exe` - Windows 安装程序
   - `macOS 26 Simulator.dmg` - macOS 安装包
   - `macOS 26 Simulator.AppImage` - Linux 可执行文件

#### 从 Artifacts 下载（手动触发）

1. 进入 "Actions" 标签
2. 点击对应的工作流运行
3. 在 "Artifacts" 部分下载：
   - `windows-installer` - Windows 安装程序
   - `macos-installer` - macOS 安装包
   - `linux-installer` - Linux 可执行文件

## 构建流程说明

GitHub Actions 会在三个不同的操作系统上并行构建：

1. **Windows (windows-latest)**
   - 构建 Windows .exe 安装程序
   - 使用 NSIS 打包器
   - 支持自定义安装目录
   - 创建桌面快捷方式

2. **macOS (macos-latest)**
   - 构建 macOS .dmg 安装包
   - 支持拖拽安装
   - 代码签名（如果配置了证书）

3. **Linux (ubuntu-latest)**
   - 构建 Linux .AppImage 可执行文件
   - 无需安装，直接运行
   - 兼容大多数 Linux 发行版

## 环境变量配置

如果您的应用需要特定的环境变量，可以在 GitHub 仓库设置中添加：

1. 进入仓库的 "Settings" > "Secrets and variables" > "Actions"
2. 点击 "New repository secret"
3. 添加需要的环境变量

然后在 `.github/workflows/build.yml` 中引用：

```yaml
env:
  YOUR_SECRET_KEY: ${{ secrets.YOUR_SECRET_KEY }}
```

## 代码签名（可选）

### Windows 代码签名

需要添加以下 secrets：
- `WINDOWS_CERTIFICATE` - Base64 编码的证书
- `WINDOWS_CERTIFICATE_PASSWORD` - 证书密码

### macOS 代码签名

需要添加以下 secrets：
- `APPLE_ID` - Apple ID
- `APPLE_ID_PASSWORD` - 应用专用密码
- `APPLE_TEAM_ID` - 团队 ID
- `CSC_LINK` - Base64 编码的证书
- `CSC_KEY_PASSWORD` - 证书密码

## 故障排除

### 构建失败

1. 检查 Actions 日志查看具体错误
2. 确保所有依赖都在 `package.json` 中正确声明
3. 验证 Electron Builder 配置是否正确

### 下载速度慢

GitHub Actions 的构建产物存储在 GitHub 服务器上，下载速度取决于网络环境。

### 构建时间长

完整的三平台构建通常需要 10-20 分钟，具体取决于项目大小和依赖数量。

## 版本管理建议

使用语义化版本号（Semantic Versioning）：

- `v1.0.0` - 主版本.次版本.修订号
- `v1.0.0-beta.1` - 预发布版本
- `v1.0.0-alpha.1` - 内测版本

每次发布新版本时：

```bash
# 更新版本号
npm version patch  # 修订版本 (1.0.0 -> 1.0.1)
npm version minor  # 次版本 (1.0.0 -> 1.1.0)
npm version major  # 主版本 (1.0.0 -> 2.0.0)

# 推送标签
git push origin --tags
```

## 注意事项

1. **首次构建**: 首次构建可能需要较长时间，因为需要下载所有依赖
2. **存储空间**: GitHub 免费账户有 500MB 的 Artifacts 存储限制
3. **构建分钟数**: GitHub 免费账户每月有 2000 分钟的 Actions 使用时间
4. **私有仓库**: 私有仓库的 Actions 使用时间会消耗得更快

## 本地测试

在推送到 GitHub 之前，建议先在本地测试构建：

```bash
# 安装依赖
pnpm install

# 构建应用
pnpm build

# 打包（仅当前平台）
pnpm electron:build
```

## 更多信息

- [Electron Builder 文档](https://www.electron.build/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [语义化版本规范](https://semver.org/)
