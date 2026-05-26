# 31. 故障排除

::: info 本章你将学到
- 出问题时**第一步该跑什么**（诊断三件套）
- 16 类常见问题的原因和修复（按出现频率排）
- Windows 专项排错段
- 怎么提交一个好的 bug report
:::

::: tip 用法：直接搜
本章用 <kbd>Ctrl+F</kbd>（macOS <kbd>Cmd+F</kbd>）搜你遇到的报错关键字，比按章节读快得多。
:::

## 25.1 诊断三件套（出问题先跑这三个）

按这个顺序跑，定位精准到每一层：

```bash
# 全面诊断（首选）
claude doctor

# 查看版本
claude --version

# 详细日志（调试 API 连接）
claude --debug "api"

# 调试 MCP 连接
claude --debug "mcp"

# 调试所有内容
claude --debug "api,mcp,hooks"

# 把调试日志写到文件
claude --debug-file /tmp/debug.log
```

在会话中：
```
/doctor       → 诊断，按 f 让 Claude 自动修复
/status       → 查看账号、模型、连接状态
/heapdump     → 导出内存堆快照（排查内存问题）
```

## 25.2 安装后 `claude` 命令找不到

**原因**：安装目录不在 `PATH` 中。

```bash
# macOS / Linux：把 ~/.local/bin 加入 PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 或 Zsh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Windows**：
- 检查是否安装了 [Git for Windows](https://git-scm.com/downloads/win)
- 重新运行安装脚本

**npm 安装后找不到**：参见 [官方故障排除文档](https://code.claude.com/docs/en/troubleshooting#native-binary-not-found-after-npm-install)。

## 25.3 登录失败 / 认证错误

```bash
# 重新登录
claude auth login

# 查看认证状态
claude auth status

# 如果用 API Key，验证 Key 是否有效
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages \
     -d '{"model":"claude-haiku-4-5","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}' \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json"
```

## 25.4 网络连接问题（国内用户）

```bash
# 测试 API 可达性
curl -I https://api.anthropic.com

# 走代理测试
curl -I --proxy http://127.0.0.1:7890 https://api.anthropic.com

# 用国内服务商
export ANTHROPIC_API_BASE="https://api.siliconflow.cn/v1"
export ANTHROPIC_API_KEY="your-siliconflow-key"
```

详细国内配置见 [国内模型接入](/claude-code/china/models)。

## 25.5 搜索失败（ripgrep 问题）

**Alpine Linux 或 musl 系统**：

```bash
# 安装依赖
apk add libgcc libstdc++ ripgrep

# 或禁用内置 ripgrep，使用系统安装的
# 在 ~/.claude/settings.json 中添加：
{
  "env": {
    "USE_BUILTIN_RIPGREP": "0"
  }
}
```

## 25.6 Windows 专项排错

### Git Bash 找不到

```json
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```

如果 Git for Windows 装在非默认位置，把路径改对。

### PowerShell 报 "`irm` is not recognized"

你在 CMD 里跑了 PowerShell 命令。换成 CMD 版安装：

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### PowerShell 报 "The token '&&' is not a valid statement separator"

你在 PowerShell 里跑了 CMD 命令。换成 PS 版安装：

```powershell
irm https://claude.ai/install.ps1 | iex
```

### `wsl --install` 报错 `0x80370102`

BIOS 里没开 CPU 虚拟化。重启进 BIOS，找 `VT-x` (Intel) 或 `SVM` (AMD) 开启。详见 [Node.js 入门](/claude-code/guide/nodejs#方案-a-wsl2-nvm)。

### 环境变量设了但 Claude 读不到

Windows 的 `setx` 命令**不会立即生效**，必须**关掉再开新 CMD/PowerShell** 才能读到。

确认环境变量是否真的存在：
```powershell
# PowerShell
[Environment]::GetEnvironmentVariable("ANTHROPIC_API_KEY", "User")
```

### 中文路径报错

Windows 默认编码可能不是 UTF-8。把 PowerShell 切到 UTF-8：

```powershell
chcp 65001
$env:PYTHONIOENCODING = "utf-8"
```

或者把项目路径换成纯英文（最稳）。

## 25.7 Claude 不遵循 CLAUDE.md

1. 运行 `/memory` 验证文件是否被加载
2. 让指令更具体：「用 2 格缩进」比「代码要整洁」有效
3. 检查多个 CLAUDE.md 是否互相冲突（运行 `claude doctor`）
4. 文件太长时精简（建议 < 200 行），或用 path-scoped rules

## 25.8 权限弹窗太频繁

```
# 方法 1：切换到 auto 模式（Shift+Tab 循环）
# 方法 2：自动生成白名单
/fewer-permission-prompts

# 方法 3：手动添加规则
/permissions
→ 添加 allow: Bash(git *) 等规则
```

## 25.9 上下文消耗太快

```
# 查看占用分布
/context

# 手动压缩
/compact 只保留关于认证的讨论

# 任务间清空
/clear

# 长研究任务交给子代理
用 Explore 子代理分析 src/ 目录
```

## 25.10 Hooks 不工作

```bash
# 验证 settings.json 语法
cat .claude/settings.json | python -m json.tool

# 临时禁用所有 hooks（排查是否是 hooks 问题）
# 在 settings.json 中添加：
{
  "disableAllHooks": true
}

# 查看已配置的 hooks
/hooks

# 手动测试 hook 脚本
echo '{"toolName":"Write","filePath":"test.ts"}' | \
  bash .claude/hooks/my-hook.sh
```

## 25.11 内存/CPU 过高

```
/heapdump     导出堆快照到桌面（然后用 Chrome DevTools 分析）
```

如果是持续性问题，检查是否有大文件被反复读取（可能是 node_modules 目录没有被忽略）。

在 `.claude/settings.json` 中排除大目录：

```json
{
  "ignorePatterns": [
    "node_modules",
    ".git",
    "dist",
    "build",
    "*.min.js"
  ]
}
```

## 25.12 怎么提交一个好的 Bug Report

如果上面都试过还是不行，要去 Discord / GitHub 报 bug。**好的 bug report 5 倍快被回复**：

```markdown
## 环境
- OS: macOS 14.5 / Windows 11 / Ubuntu 22.04
- Claude Code 版本: （跑 `claude --version`）
- 终端: iTerm2 / Windows Terminal / Git Bash
- Node.js 版本（如适用）: （跑 `node --version`）

## 怎么复现
1. 跑这条命令: `claude xxx`
2. 在第 N 步发生错误

## 期望
（应该发生什么）

## 实际
（实际发生了什么 + 完整报错截图或文本）

## 已经试过的（避免重复让对方建议）
- claude doctor 输出:（贴出来）
- 是否能在另一个干净项目复现:（是 / 否）
- 是否能用 --bare 模式复现:（试 `claude --bare`）

## 调试日志（如果不涉及敏感信息）
（跑 `claude --debug-file /tmp/debug.log --debug "api"`，附在 issue 里）
```

## 25.13 获取帮助

| 渠道 | 说明 |
|------|------|
| 📚 官方文档 | [code.claude.com/docs](https://code.claude.com/docs) |
| 🐛 故障排除 | [code.claude.com/docs/en/troubleshooting](https://code.claude.com/docs/en/troubleshooting) |
| 💬 Discord | [anthropic.com/discord](https://www.anthropic.com/discord) |
| 🐙 GitHub Issues | [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues) |
| 💡 会话内 | 输入 `/help`，或直接问 Claude「怎么...」|
| 📮 反馈 | `/feedback` 或 `/bug` |
| 💬 本站学习群 | [学习与交流](/community)（中文社区）|
