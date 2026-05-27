# 2. 安装 Codex

> **本文你将学会：** 在 macOS、Linux、Windows 三个平台上安装并验证 Codex CLI。

::: tip 第一次接触 Node.js / npm / 命令行？先看这里
Codex 是用 Node.js 写的，**必须先装好 Node.js + npm** 才能装它。

- 完全没接触过 Node.js？→ 先看 [Node.js 与 npm 入门（可选）](/claude-code/guide/nodejs) 把环境装好再回来
- 已经装好 Node.js 18+ 了？→ 直接跳到 [安装 Codex](#安装-codex)
:::

::: warning 国内用户特别提示
**注册 OpenAI 账号很难**（不接受国内手机号 / 信用卡 / 部分地区 IP）。如果你不想折腾官方 OpenAI，**强烈建议直接走国内模型方案**：

→ [接入国内模型（DeepSeek / 通义千问 / Kimi）](/codex/china-models/overview) — 同样的 Codex，免翻墙、人民币支付、模型能力够用

本章主要讲怎么安装 Codex CLI 本身，**这一步无论你用 OpenAI 还是国内模型都必须做**。
:::

## 前置：确认 Node.js 已装好

打开终端，跑：

```bash
node --version
```

| 输出 | 含义 |
|---|---|
| `v22.x.x` / `v20.x.x` / `v18.x.x` | ✅ 已装好，跳到 [安装 Codex](#安装-codex) |
| `v16.x.x` 或更低 | ❌ 版本太老，[去这里升级](/claude-code/guide/nodejs#为什么用-nvm-而不是直接装) |
| `command not found` / `不是内部或外部命令` | ❌ 没装 Node.js，[去这里装](/claude-code/guide/nodejs) |

::: tip 推荐：用 nvm 装 Node.js
直接从 nodejs.org 装会踩两个坑：升级麻烦、`npm install -g` 经常报权限错。**用 nvm 装能完全避开**。完整指引见 [Node.js 与 npm 入门](/claude-code/guide/nodejs)。
:::

## 安装 Codex

Node.js 准备好后，一条命令全局安装：

```bash
npm install -g @openai/codex
```

::: tip 国内用户先换镜像
官方源在国内很慢。先换淘宝镜像再装：
```bash
npm config set registry https://registry.npmmirror.com
npm install -g @openai/codex
```
:::

### 验证安装成功

```bash
codex --version
```

**预期输出**：
```
codex/1.x.x
```

只要能输出版本号就成功了。看到 `command not found`？去看 [常见问题](#命令找不到-command-not-found)。

## 首次运行

```bash
codex
```

第一次运行会做两件事：
1. **创建配置目录** `~/.codex/`
2. **进入一个全屏终端 UI**（黑底+底部输入框）

::: info `~/.codex/` 里都有啥
```
~/.codex/
├── config.toml     ← 主配置文件（模型、API Key 等）
├── instructions.md ← 全局自定义指令（可选）
└── skills/         ← 自定义技能文件（可选）
```
（`~` 是你的用户主目录——macOS `/Users/你的用户名`、Linux `/home/你的用户名`、Windows `C:\Users\你的用户名`）
:::

## macOS 完整演示

```bash
# 1. 如果还没装 nvm + Node.js，先装（详见 Claude Code 的 Node.js 入门）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 关掉终端重新打开（让 nvm 进 PATH）

# 2. 装 Node.js 22 LTS
nvm install 22
nvm use 22
nvm alias default 22

# 3. 装 Codex
npm install -g @openai/codex

# 4. 验证
codex --version
# 预期：codex/1.x.x

# 5. 启动
codex
```

## Linux 完整演示

```bash
# Ubuntu / Debian（用 NodeSource 仓库）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证 Node + npm
node --version    # 预期：v22.x.x
npm --version     # 预期：10.x.x 或更高

# 装 Codex
npm install -g @openai/codex

# 验证
codex --version
```

::: tip 推荐 nvm 而非 NodeSource
NodeSource 这种 apt 仓库装法**全局共享**、需要 sudo、升级麻烦。如果你只是个人开发用，**nvm 路径更省心**——详见 [Node.js 入门](/claude-code/guide/nodejs#linux-安装)。
:::

## Windows 完整演示

Windows 上有两条路：

| 方案 | 适合谁 |
|---|---|
| **A. WSL2 + Linux 风格**（推荐） | 想跟 Mac/Linux 一致体验、用 GitHub Actions / SDK |
| **B. 原生 PowerShell** | 只想最快跑通，不碰 WSL |

### 方案 A：WSL2（推荐）

完整步骤见 [Windows + WSL2 完整配置](/codex/advanced/windows-setup)。简化版：

```powershell
# 1. PowerShell 管理员身份运行
wsl --install -d Ubuntu

# 2. 重启电脑 → 开始菜单搜 "Ubuntu" 打开 → 设用户名密码

# 3. 后续所有命令在 Ubuntu 终端里跑，按上面 Linux 完整演示走
```

### 方案 B：PowerShell 原生

1. 去 [nodejs.org](https://nodejs.org) 下载 **LTS 版**安装包（`.msi`）
2. 双击安装，**一路 Next**（默认选项即可）
3. 打开**新的** PowerShell 验证：
   ```powershell
   node --version
   npm --version
   ```
4. 装 Codex：
   ```powershell
   npm install -g @openai/codex
   codex --version
   ```

::: warning Windows 原生支持有限
Codex 在 Windows 原生跑会有一些命令兼容性问题（路径、shell 命令）。**遇到坑就换 WSL2**，体验差很多。
:::

## 常见安装问题

### `npm install -g` 报权限错（EACCES）

::: danger 不要用 `sudo`！
有人会说"加 sudo 就好了"——**绝对不要**。`sudo npm install -g` 会污染 npm 全局目录的所有权，**之后每次装包都得 sudo**，越搞越乱。
:::

**正确做法**：给 npm 换一个用户可写的全局目录：

```bash
# 1. 建用户级 npm 全局目录
mkdir ~/.npm-global

# 2. 让 npm 指向那里
npm config set prefix '~/.npm-global'

# 3. 把它加进 PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
# zsh 用户用 .zshrc，bash 用户改成 .bashrc

# 4. 重新装
npm install -g @openai/codex
```

::: tip 一劳永逸：直接用 nvm
nvm 自带用户级路径，**根本不会遇到权限问题**。如果你还没装 Node.js、看到这里头大，强烈建议回头 [用 nvm 装 Node.js](/claude-code/guide/nodejs#为什么用-nvm-而不是直接装)。
:::

### 命令找不到（command not found）

装完 `npm install -g @openai/codex` 但跑 `codex` 报"找不到命令"：

```bash
# 1. 看 npm 全局 bin 目录在哪
npm config get prefix
# 输出类似：/Users/me/.npm-global

# 2. 看当前 PATH
echo $PATH    # macOS / Linux
$env:PATH     # Windows PowerShell

# 3. 如果第 1 步的目录 + /bin 不在 PATH 里，加进去：
echo 'export PATH="/Users/me/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 4. 重新跑
codex --version
```

### Windows 上 `node` 命令找不到

可能 nodejs 安装时漏了"Add to PATH"勾选项。**重装一遍**，安装界面所有 checkbox 都默认勾着别动。

### `npm install` 卡住不动 / 超慢

99% 是国内网络问题。换淘宝镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

## 下一步

安装完成后选一个走：

- 🇨🇳 **国内用户** → [接入国内模型](/codex/china-models/overview)（绕过 OpenAI 注册难）
- 🔑 **有 OpenAI 账号** → [认证与 API Key](/codex/guide/authentication) 配置凭证
- 🚀 **想立刻试** → [快速开始](/codex/guide/quick-start) 5 分钟跑通第一个任务
