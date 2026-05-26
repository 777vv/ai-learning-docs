# 30. IDE 集成

::: info 本章你将学到
- VS Code 和 Cursor 插件安装和使用
- JetBrains 插件（IntelliJ、PyCharm、WebStorm 等）
- 终端快捷键配置（Shift+Enter 多行输入）
- 从终端自动连接 IDE
:::

## 24.1 VS Code / Cursor

### 安装

```bash
# 方式一：命令行安装
code --install-extension anthropic.claude-code

# 方式二：在 Extensions 搜索 "Claude Code"
```

安装后重启 VS Code。

### 使用

1. 打开命令面板（<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>）
2. 搜索 "Claude Code: Open in New Tab"
3. 或者在内置终端中运行 `claude`

### VS Code 独有功能

| 功能 | 说明 |
|------|------|
| **内联 diff 查看** | Claude 的改动直接在编辑器里显示 diff，点击接受/拒绝 |
| **@-mentions** | 在提示里输入 `@filename` 引用当前打开的文件 |
| **计划审查** | 计划模式下的 plan 可以在编辑器里直接修改 |
| **会话历史** | 在侧边栏查看和恢复历史会话 |

### 从终端自动连接

```bash
# 启动 Claude 时自动连接到已打开的 VS Code 窗口
claude --ide

# 在 worktree 中同时连接 IDE
claude -w feature-x --ide
```

### Cursor 特别说明

Cursor 内置了 Claude 集成，安装 Claude Code 插件后可以：
- 在 Cursor 聊天面板旁边开启 Claude Code 模式
- 共享 Cursor 的代码索引，减少 Claude Code 重复分析

## 24.2 JetBrains IDE

支持：IntelliJ IDEA、PyCharm、WebStorm、GoLand、Rider 等所有 JetBrains IDE。

### 安装

从 JetBrains Marketplace 安装：

1. 打开 IDE → Settings → Plugins → Marketplace
2. 搜索 "Claude Code"
3. 安装并重启 IDE

或直接访问：[plugins.jetbrains.com/plugin/27310-claude-code-beta-](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-)

### JetBrains 独有功能

| 功能 | 说明 |
|------|------|
| **Diff 查看** | 在 IDE 的 diff 视图中查看 Claude 的修改 |
| **选区共享** | 选中代码后，Claude Code 终端中会自动引用该选区 |

## 24.3 终端快捷键配置

默认情况下，<kbd>Shift</kbd>+<kbd>Enter</kbd> 在很多终端里不发送换行。运行以下命令配置：

```
/terminal-setup
```

这会自动为以下终端配置 <kbd>Shift</kbd>+<kbd>Enter</kbd> 换行：
- VS Code 内置终端
- Cursor 内置终端
- Alacritty
- Kitty
- iTerm2（macOS）

配置完成后，你可以用 <kbd>Shift</kbd>+<kbd>Enter</kbd> 输入多行提示，<kbd>Enter</kbd> 提交。

### 手动配置 VS Code 终端

在 VS Code `settings.json` 中添加：

```json
{
  "terminal.integrated.sendKeybindingsToShell": false,
  "terminal.integrated.allowChords": false,
  "terminal.integrated.windowsEnableConpty": true
}
```

## 24.4 桌面应用

macOS 和 Windows 的原生桌面应用，适合不想用终端的用户：

**特有功能**：
- **并行会话**：同时查看多个 Claude 会话的进度
- **可视化 diff 审查**：图形化界面审查代码改动
- **定时任务**：在应用内设置和管理定时任务
- **通知**：任务完成或需要确认时弹出系统通知

在终端会话中切换到桌面应用：

```
/desktop    把当前会话转到桌面 App
/app        同上（别名）
```

## 24.5 网页版（claude.ai/code）

不需要任何安装，在浏览器里运行：

**适用场景**：
- 启动长任务后可以关机离开，任务在云端继续运行
- 没有本地环境时快速使用
- 把网页会话拉回本地：`/teleport`（别名 `/tp`）

---

下一步：[故障排除](/claude-code/tips/troubleshoot)
