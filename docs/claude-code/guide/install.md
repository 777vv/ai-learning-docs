# 3. 安装

::: info 本章你将学到
- 5 种安装方式及其适用场景
- 各平台的详细安装步骤
- 如何验证安装和卸载
:::

::: tip 没碰过命令行 / Node.js 的人先看这里
- **走「官方脚本」或 Windows「WinGet」**：照着本章做，**不需要装 Node.js**，最省事 → 直接看 3.2 / 3.3
- **走「npm」路径**：需要 Node.js 18+，先回头看 [Node.js 与 npm 入门（可选）](/claude-code/guide/nodejs) → 再回这里看 3.6
:::

## 3.1 安装方式对比

| 方式 | 平台 | 是否自动更新 | 推荐程度 |
|------|------|------------|---------|
| **官方安装脚本** | macOS / Linux / WSL | ✅ 自动后台更新 | ⭐⭐⭐ 首选 |
| **WinGet** | Windows | 手动 `winget upgrade` | ⭐⭐⭐ Windows 首选 |
| **Homebrew** | macOS / Linux | 手动 `brew upgrade` | ⭐⭐ 习惯 Homebrew 的用户 |
| **apt / dnf / apk** | Linux | 系统包管理器管理 | ⭐⭐ Linux 服务器 |
| **npm** | 全平台（需 Node.js 18+） | 手动 `npm update` | ⭐ 备选 |

## 3.2 方式一：官方安装脚本（推荐）

官方安装脚本会自动配置后台更新，保持 Claude Code 始终是最新版。

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://claude.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

::: warning Windows 前置条件
使用 Windows 原生安装前，请先安装 [Git for Windows](https://git-scm.com/downloads/win)。安装时勾选「Add Git to PATH」。

- 看到 `'irm' is not recognized` → 你在 CMD，用 CMD 方式
- 看到 `The token '&&' is not a valid statement separator` → 你在 PowerShell，用 PS 方式
:::

## 3.3 方式二：WinGet（Windows 推荐）

```powershell
# 安装
winget install Anthropic.ClaudeCode

# 手动升级
winget upgrade Anthropic.ClaudeCode
```

## 3.4 方式三：Homebrew（macOS / Linux）

```bash
# 安装稳定版
brew install --cask claude-code

# 安装最新版（可能包含预览功能）
brew install --cask claude-code@latest

# 手动升级
brew upgrade claude-code
```

## 3.5 方式四：Linux 包管理器

::: code-group

```bash [Debian / Ubuntu (apt)]
# 添加 GPG 密钥
sudo install -d -m 0755 /etc/apt/keyrings
sudo curl -fsSL https://downloads.claude.ai/keys/claude-code.asc \
    -o /etc/apt/keyrings/claude-code.asc

# 添加软件源
echo "deb [signed-by=/etc/apt/keyrings/claude-code.asc] \
    https://downloads.claude.ai/claude-code/apt/stable stable main" \
    | sudo tee /etc/apt/sources.list.d/claude-code.list

# 安装
sudo apt update && sudo apt install claude-code
```

```bash [RHEL / Fedora (dnf)]
sudo dnf config-manager --add-repo \
    https://downloads.claude.ai/claude-code/rpm/claude-code.repo
sudo dnf install claude-code
```

```bash [Alpine (apk)]
# 添加 libgcc（某些发行版需要）
apk add libgcc libstdc++

curl -fsSL https://downloads.claude.ai/claude-code/apk/install.sh | sh
```

:::

## 3.6 方式五：npm

::: warning 前置条件
- 必须有 **Node.js 18+**——没装的话先去 [Node.js 与 npm 入门（可选）](/claude-code/guide/nodejs) 装好
- **不要**用 `sudo npm install -g`，会导致后续无穷无尽的权限问题
:::

**第 1 步**：确认 Node.js 与 npm 在位
```bash
node --version   # 应输出 v18.x.x 或更高
npm --version    # 应输出 9.x.x 或更高
```
如果命令找不到，回头看 [Node.js 入门](/claude-code/guide/nodejs)。

**第 2 步**：装 Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

国内用户如果卡住，先换淘宝镜像（[详见这里](/claude-code/guide/nodejs#国内-npm-加速-强烈推荐)）：
```bash
npm config set registry https://registry.npmmirror.com
npm install -g @anthropic-ai/claude-code
```

**第 3 步**：验证装好了
```bash
claude --version
# 应输出: claude-code/2.x.x
```

### 如果报权限错（EACCES）

**绝对不要用 `sudo`**——那会污染 npm 全局目录的所有权，之后每次装包都得 sudo，越搞越乱。

正确做法是给 npm 换一个用户可写的全局目录：

```bash
# 1. 创建用户级 npm 全局目录
mkdir ~/.npm-global

# 2. 让 npm 指向那里
npm config set prefix '~/.npm-global'

# 3. 把它加进 PATH（写进 ~/.bashrc 或 ~/.zshrc）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
# zsh 用户把 .bashrc 换成 .zshrc

# 4. 重新装
npm install -g @anthropic-ai/claude-code
```

::: tip 更省心的做法：用 nvm
如果你还没装 Node.js，**直接用 nvm 装**——nvm 自带用户级路径，根本不会遇到权限问题。见 [Node.js 入门](/claude-code/guide/nodejs#为什么用-nvm-而不是直接装)。
:::

## 3.7 验证安装

安装完成后，打开新终端窗口运行：

```bash
# 查看版本号
claude --version

# 全面诊断安装与配置
claude doctor
```

`claude doctor` 会检查：
- 二进制文件位置
- 版本信息
- 网络连接状态
- 账号认证状态
- 配置文件位置

如果 `claude` 命令找不到，参见 [故障排除](/claude-code/tips/troubleshoot#安装后-claude-命令找不到)。

## 3.8 卸载

::: code-group

```bash [原生安装 macOS/Linux/WSL]
# 删除二进制文件
rm -f ~/.local/bin/claude

# 删除程序数据
rm -rf ~/.local/share/claude
```

```powershell [原生安装 Windows]
Remove-Item "$env:USERPROFILE\.local\bin\claude.exe" -Force
Remove-Item "$env:USERPROFILE\.local\share\claude" -Recurse -Force
```

```powershell [WinGet]
winget uninstall Anthropic.ClaudeCode
```

```bash [Homebrew]
brew uninstall --cask claude-code
```

```bash [npm]
npm uninstall -g @anthropic-ai/claude-code
```

:::

如需彻底删除所有配置和历史记录：

```bash
# 注意：这会删除所有 CLAUDE.md、设置、会话历史
rm -rf ~/.claude
rm -f ~/.claude.json
```

---

下一步：[登录认证](/claude-code/guide/auth)
