# Electron 打包说明

本项目已配置 Electron，可以将 macOS 26 模拟器打包为独立的桌面应用程序。

## 开发模式

在开发模式下运行 Electron 应用：

```bash
pnpm electron:dev
```

这将同时启动后端服务器和 Electron 窗口。

## 打包为可执行文件

### Windows (.exe)

```bash
pnpm electron:build
```

生成的文件位于 `release/` 目录：
- `macOS 26 Simulator Setup.exe` - Windows 安装程序

### macOS (.dmg)

在 macOS 系统上运行：

```bash
pnpm electron:build
```

生成的文件位于 `release/` 目录：
- `macOS 26 Simulator.dmg` - macOS 安装包

### Linux (.AppImage)

在 Linux 系统上运行：

```bash
pnpm electron:build
```

生成的文件位于 `release/` 目录：
- `macOS 26 Simulator.AppImage` - Linux 可执行文件

## 仅打包不创建安装程序

如果只想打包应用而不创建安装程序：

```bash
pnpm pack
```

## 配置说明

Electron 配置位于 `package.json` 的 `build` 字段中，包含：

- **appId**: 应用程序唯一标识符
- **productName**: 应用程序显示名称
- **directories**: 输出目录配置
- **files**: 需要打包的文件
- **win/mac/linux**: 各平台特定配置

## 注意事项

1. **跨平台打包**: 
   - Windows 安装程序只能在 Windows 上构建
   - macOS 安装包只能在 macOS 上构建
   - Linux 包可以在 Linux 或 macOS 上构建

2. **图标文件**: 
   - 确保 `client/public/icon.png` 存在
   - Windows 需要 .ico 格式（可自动转换）
   - macOS 需要 .icns 格式（可自动转换）

3. **依赖项**: 
   - 所有 node_modules 都会被打包
   - 打包后的应用体积较大（约 200-300MB）

4. **环境变量**: 
   - 需要在打包前配置好所有必需的环境变量
   - 或在 Electron 主进程中动态配置

## 分发

打包完成后，可以将 `release/` 目录中的安装程序分发给用户：

- **Windows**: 用户运行 `.exe` 安装程序
- **macOS**: 用户打开 `.dmg` 并拖拽到应用程序文件夹
- **Linux**: 用户赋予 `.AppImage` 执行权限后运行

## 自动更新

如需添加自动更新功能，可以集成 `electron-updater`：

```bash
pnpm add electron-updater
```

然后在 `electron/main.js` 中配置更新逻辑。
