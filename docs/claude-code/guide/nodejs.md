# Node.js 与 npm 入门（可选）

::: info 本章你将学到
- 什么时候你**需要**装 Node.js，什么时候**不用**装
- 三大系统的零基础安装步骤（Win / Mac / Linux）
- 为什么用 nvm 而不是直接装
- 验证 Node.js 与 npm 工作的标准命令
- 国内 npm 加速 + 常见报错速查
:::

::: tip 这章是可选的——先看你是不是真的需要
- ✅ **你不需要装**：只想用 Claude Code 写代码，并且打算走 [官方安装脚本 / WinGet / Homebrew](/claude-code/guide/install) → **跳过这章**
- ⚠️ **你需要装**：上一章 [系统要求](/claude-code/guide/requirements) 提到你要走 `npm install -g`、用 [Agents SDK](/claude-code/integration/agents-sdk) 或 [GitHub Actions](/claude-code/integration/github-actions) → **必读**
:::

## 一句话：Node.js 是什么？

Node.js 是个**让 JavaScript 跑在你电脑上**的运行时——可以理解成"PC 端的 JS 引擎"。

它附带一个叫 **npm**（Node Package Manager）的工具，是 JS 生态的"软件商店"。`npm install -g xxx` 就是"全局装某个软件"。

很多命令行工具——包括 Claude Code（其中一种装法）、`@anthropic-ai/claude-agent-sdk`、各种 CLI——都是用 Node.js 写的，要装它们就得先有 Node.js。

::: tip 装一次受益很多年
即使你只是为了 Claude Code 来装，**Node.js 装好之后能跑的工具远不止它**——后端服务、命令行工具、AI Agent 框架、博客生成器等等。这不是为了 Claude Code 临时折腾的东西，是值得长期投入的基础工具。
:::

## 该装什么版本？

| 版本 | 推荐度 | 备注 |
|---|---|---|
| **Node.js 22.x LTS**（推荐） | ⭐⭐⭐⭐⭐ | 长期支持、稳定，所有 Claude Code 生态都能跑 |
| Node.js 20.x LTS | ⭐⭐⭐⭐ | Claude Code 最低要求是 18，20 同样能跑 |
| Node.js 18.x | ⭐⭐⭐ | Claude Code 官方最低，但部分 SDK 工具已要求 20+ |
| Node.js ≤ 16 | ❌ | 不要用，会报错 |

新装直接 22 LTS；已有 18+ 不用动。

## 为什么用 nvm 而不是直接装？

**nvm** = Node Version Manager（Node 版本管理器）。

直接从 nodejs.org 装的问题：
- 想升级要重新下载、重新装
- 多个项目要求不同 Node 版本时切换困难
- `npm install -g` 经常因为权限报错（`EACCES`）

用 nvm 装的好处：
- `nvm install 22` 一条命令装新版
- `nvm use 20` 一秒切到旧版
- 装包**不需要 sudo**，从源头避免权限污染
- 跨平台一致体验

**所以本章统一用 nvm**。Windows 用 nvm-windows（或 WSL2 里的 nvm），Mac/Linux 用 nvm。

## Windows 安装

Windows 上有两条路：

| 方案 | 适合谁 |
|---|---|
| **A. WSL2 + nvm**（推荐） | 想接触 Linux 生态、用 SDK / GitHub Actions | 
| **B. nvm-windows** | 只想最快装好、不碰 WSL |

### 方案 A：WSL2 + nvm

::: warning 前提：你 BIOS 已经开了 CPU 虚拟化
如果后面 `wsl --install` 报错 `0x80370102`，到 BIOS 里找 `VT-x` (Intel) 或 `SVM` (AMD) 打开。
:::

**第 1 步**：打开 **PowerShell（管理员）**——开始菜单搜 PowerShell，右键「以管理员身份运行」。

```powershell
wsl --install -d Ubuntu
```

这一条命令做完：启用 WSL 功能 → 装 WSL2 内核 → 装 Ubuntu。完事**重启电脑**。

**第 2 步**：重启后开始菜单搜 "Ubuntu" 打开。首次启动让你设：
- 用户名（小写英文，比如姓的拼音）
- 密码（输的时候**屏幕不会有星号**，是正常的）

进去后跑：
```bash
sudo apt update && sudo apt upgrade -y
```

**第 3 步**：在 Ubuntu 里装 nvm：
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

::: tip 国内用户备用
如果上面卡住或下载失败，用 Gitee 镜像：
```bash
curl -o- https://gitee.com/mirrors/nvm/raw/v0.40.1/install.sh | bash
```
:::

**关掉终端、再重新打开**（让 nvm 进环境变量），然后验证：
```bash
command -v nvm
# 应该输出: nvm
```

**第 4 步**：装 Node.js 22：
```bash
nvm install 22
nvm use 22
nvm alias default 22
```

✅ 装好后**以后所有 npm / Claude Code 命令都在 Ubuntu 终端跑**，不要在 PowerShell。

### 方案 B：nvm-windows

不想碰 WSL，可以用 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)：

1. 下载 `nvm-setup.exe` → 双击安装（**关掉所有 Node 相关进程再装**）
2. 装完打开新的 **PowerShell** 或 **CMD**，跑：

```powershell
nvm install 22.11.0
nvm use 22.11.0
```

::: warning nvm-windows 不能 + WSL nvm 混用
两个工具会互相打架，**只装一个**。
:::

## macOS 安装

打开终端（`⌘ + 空格` 搜 "Terminal"）。

### 第 1 步：装 Homebrew（如果还没装）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

::: tip 国内用户镜像
官方源很慢的话，用清华镜像：
```bash
/bin/bash -c "$(curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/install.sh)"
```
:::

装完按它提示加 PATH（典型的是把 `eval "$(/opt/homebrew/bin/brew shellenv)"` 写进 `~/.zshrc`）。

### 第 2 步：装 nvm

```bash
brew install nvm
```

按 Homebrew 输出的 Caveats 提示，把以下加进 `~/.zshrc`：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"
```

跑 `source ~/.zshrc` 让它生效。

### 第 3 步：装 Node 22

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

## Linux 安装

```bash
# 第 1 步：装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 国内用 Gitee 镜像：
# curl -o- https://gitee.com/mirrors/nvm/raw/v0.40.1/install.sh | bash

# 第 2 步：让 nvm 生效（关掉终端重开也行）
source ~/.bashrc       # bash 用户
# 或
source ~/.zshrc        # zsh 用户

# 第 3 步：装 Node 22
nvm install 22
nvm use 22
nvm alias default 22
```

## 验证安装成功

不管哪个平台，装完都应该满足：

```bash
node --version
# 应输出: v22.x.x（或你装的版本）

npm --version
# 应输出: 10.x.x 或更高
```

如果两条都对，**Node.js 装好了**。

## 国内 npm 加速（强烈推荐）

国内访问 npm 官方仓库（`registry.npmjs.org`）速度感人。换淘宝镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

验证：
```bash
npm config get registry
# 输出: https://registry.npmmirror.com
```

以后所有 `npm install` 都走国内镜像，速度起飞。

::: tip 想切回官方源
```bash
npm config set registry https://registry.npmjs.org
```
:::

## 装包速度还不够快？pnpm

如果你嫌 npm 慢、占磁盘多，可以装 **pnpm**（速度快 2-3 倍）：

```bash
npm install -g pnpm
```

后续装包用 `pnpm install` 代替 `npm install`。

::: tip 新手不必折腾
能跑就别瞎换。等用熟了再考虑 pnpm / bun。
:::

## 常见报错速查

### Q：`nvm: command not found`
A：nvm 没装好或配置文件没 source。
```bash
# Mac/Linux
source ~/.zshrc   # 或 ~/.bashrc

# 或关掉终端重开
```

### Q：`npm install -g xxx` 报 `EACCES` / `Permission denied`
A：你**不该用 sudo**。用 nvm 装的 Node 不需要 sudo。如果之前用 `sudo npm install` 污染过权限，修复：
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Q：Windows 下 `wsl --install` 报错 `0x80370102`
A：BIOS 里没开 CPU 虚拟化。重启进 BIOS，找 `VT-x` (Intel) 或 `SVM` (AMD) 开启。

### Q：装完 nvm，但 `node` 命令找不到
A：可能没运行 `nvm use 22` 或没设 default。再来一次：
```bash
nvm use 22
nvm alias default 22
```

### Q：`npm install` 卡住不动 / 超慢
A：换淘宝镜像（见上一节）。

### Q：Windows 装了 nvm-windows，又装了 WSL 的 nvm，互相冲突
A：选一个用。建议保留 WSL 里的 nvm，把 nvm-windows 卸了：
```
设置 → 应用 → NVM for Windows → 卸载
```

## 自查清单

确认以下都过，再回头去装 Claude Code：

```bash
# 1. Node.js 版本 >= 18
node --version

# 2. npm 能用
npm --version

# 3. 全局装包不报权限错（试装一个无关包）
npm install -g cowsay
cowsay hello
# 能看到一头牛说 hello 就 OK

# 4. （国内用户）npm 镜像已换
npm config get registry
# 应该是淘宝镜像
```

四条都过 → 准备好了。

---

## 看完这一章你应该知道

✅ Node.js 是 JS 运行时，npm 是它带的"软件商店"
✅ Win/Mac/Linux 都推荐用 nvm 装，省事且不踩权限坑
✅ 推荐装 Node.js 22 LTS
✅ 国内必换淘宝镜像
✅ 自查清单 4 条全过 = 准备好了

---

**下一步**：[3. 安装 Claude Code →](/claude-code/guide/install)

回到主线，挑一种安装方式装上。
