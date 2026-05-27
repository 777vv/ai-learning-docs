# 21. Windows + WSL2 完整配置

> **本文你将学会：** 在 Windows 10/11 上跑 Codex 的完整步骤——含 WSL2 vs PowerShell 决策、虚拟化前置检查、Windows 文件路径在 WSL 里怎么找。

## WSL2 vs PowerShell 决策表

Windows 上跑 Codex 有两条路，**先选一条再开始**：

| | WSL2 + Linux 风格（推荐） | PowerShell 原生 |
|---|---|---|
| **难度** | 中（需装 WSL2 + Linux） | 低（双击 .msi 装 Node 就行） |
| **首次设置时间** | 15-30 分钟 | 5 分钟 |
| **跟 Mac/Linux 教程一致** | ✅ | ❌（命令格式不同） |
| **Shell 命令兼容性** | ✅ 完整（grep / find / ls 都有） | ⚠️ PowerShell 没有部分 Unix 命令 |
| **npm 全局装包稳定性** | ✅ 不踩权限坑 | ⚠️ 偶尔权限错 |
| **跟 Windows 资源管理器交互** | 需要走 `/mnt/c/...` 路径 | ✅ 原生支持 |
| **GitHub Actions / SDK 开发** | ✅ 一致体验 | ⚠️ 可能踩坑 |
| **运行性能** | 接近原生 Linux | 接近原生 Windows |

**怎么选**：
- 🎯 **想长期用 Codex / 跟着 Mac/Linux 教程走** → **WSL2**
- 🎯 **只想最快跑通 / 不愿折腾** → **PowerShell 原生**（先用，遇到坑再切 WSL2 不晚）

::: warning Codex 在 PowerShell 原生支持有限
某些 Shell 命令（如 `grep` / `find` / 链式管道）在 PowerShell 里行为不一样，Codex 跑某些任务可能报错或表现奇怪。**遇到一次坑就建议切 WSL2**。
:::

---

## 路线 A：WSL2 完整流程

### 前置：确认你的电脑支持

::: warning 三个前置条件
1. **Windows 10 v2004（Build 19041）+ 或 Windows 11**——看下面怎么查
2. **64 位 CPU**（基本都是）
3. **CPU 虚拟化已开启**（很多人卡在这里）
:::

**查 Windows 版本**：按 `Win + R` → 输入 `winver` → 回车，弹窗显示版本号。

**查 CPU 虚拟化是否开启**：

::: code-group

```text [方式 1：任务管理器（最快）]
1. Ctrl + Shift + Esc 打开任务管理器
2. 切到「性能」标签 → 选「CPU」
3. 右下角看「虚拟化:」
   - 已启用 ✅ 可以装 WSL2
   - 已禁用 ❌ 必须先去 BIOS 开（看下方步骤）
```

```text [方式 2：systeminfo]
打开 PowerShell 跑：
  systeminfo | findstr /C:"Hyper-V"

看到 "已启用" / "是" 就是开了
```

:::

**虚拟化没开 → 进 BIOS 开**：

1. 重启电脑，**开机时连续按** F2 / Del / F10 / Esc（不同品牌不同——HP / 联想 F2、华硕 F2 或 Del、戴尔 F2、惠普 Esc 后按 F10）
2. 进 BIOS 后找：
   - **Intel CPU**：`Intel Virtualization Technology` / `Intel VT-x` / `VT-d` —— 设为 `Enabled`
   - **AMD CPU**：`SVM Mode` / `AMD-V` —— 设为 `Enabled`
3. 按 F10 保存退出，重启
4. 再用任务管理器确认"虚拟化: 已启用"

### 第 1 步：安装 WSL2

::: warning 用管理员身份打开 PowerShell
1. 按 `Win` 键
2. 输入 `PowerShell`
3. 右键 `Windows PowerShell` → 选「**以管理员身份运行**」
4. 弹出确认窗口点「是」
:::

```powershell
# 这一条命令同时做：启用 WSL 功能 + 装 WSL2 内核 + 装 Ubuntu 发行版
wsl --install
```

**预期输出**：
```
正在安装: 虚拟机平台
正在安装: 适用于 Linux 的 Windows 子系统
正在下载: Ubuntu
正在安装: Ubuntu
请求的操作成功了。直到重新启动系统前更改将不会生效。
```

**重启电脑**。

### 第 2 步：首次启动 Ubuntu

重启后：
1. 开始菜单搜 **Ubuntu** 打开
2. 第一次启动会自动进入 Ubuntu 初始化
3. **设置用户名**（小写英文，比如 `tom` 或姓拼音）
4. **设置密码**——⚠️ **输入时屏幕不会显示星号**，是正常的，盲打两次相同

进去后跑：
```bash
sudo apt update && sudo apt upgrade -y
# 输密码（就是刚才设的那个）
```

**验证 WSL2 装好了**（在 PowerShell 跑）：
```powershell
wsl --list --verbose
```

应该看到：
```
  NAME      STATE       VERSION
* Ubuntu    Running     2
```

`VERSION 2` 才是 WSL2，`VERSION 1` 是老版本——升级：
```powershell
wsl --set-version Ubuntu 2
```

### 第 3 步：在 WSL2 中装 Node.js + Codex

::: tip 这一步跟 Linux 完全一样
后续命令都在 **Ubuntu 终端**里跑（不是 PowerShell）。详细 Node.js 安装 + 国内 npm 镜像走 [Node.js 与 npm 入门](/claude-code/guide/nodejs)。
:::

简化版：

```bash
# 1. 装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 2. 关掉 Ubuntu 终端再开（让 nvm 进 PATH），然后：
nvm install 22
nvm use 22
nvm alias default 22

# 3. 国内用户换 npm 镜像
npm config set registry https://registry.npmmirror.com

# 4. 装 Codex
npm install -g @openai/codex

# 5. 验证
codex --version
```

### 第 4 步：配模型

参考 [认证与 API Key](/codex/guide/authentication) 或 [国内模型对接](/codex/china-models/overview)。简化版（DeepSeek）：

```bash
mkdir -p ~/.codex
nano ~/.codex/config.toml
```

粘贴：
```toml
[model_providers.deepseek]
name = "deepseek"
api_key = "sk-你的 DeepSeek Key"
base_url = "https://api.deepseek.com/v1"

[model]
provider = "deepseek"
name = "deepseek-chat"
```

`Ctrl + X` → `Y` → 回车保存。

### 第 5 步：在 Windows 项目目录跑 Codex

::: info Windows 路径在 WSL 怎么写？
WSL2 把你的 C 盘挂在 `/mnt/c/`，D 盘挂在 `/mnt/d/`，以此类推。

**举例**：
- Windows 里 `C:\Users\Tom\Desktop\my-project`
- 在 WSL 里写成 `/mnt/c/Users/Tom/Desktop/my-project`

转换规则：
- `C:\` → `/mnt/c/`
- `\` → `/`
- 大小写要对应（虽然 NTFS 不区分，但有时候有坑）
:::

```bash
# 进入 Windows 上的项目目录
cd /mnt/c/Users/你的用户名/Desktop/my-project

# 启动 Codex
codex
```

🎉 接下来跟 macOS / Linux 完全一样。

---

## 路线 B：PowerShell 原生（不用 WSL2）

::: warning 局限
- 某些 Shell 命令（grep / find / 管道）行为不同，Codex 部分任务会奇怪
- npm 全局装包偶尔权限错
- 不能跟 Mac / Linux 教程的命令完全对齐

**只推荐"想最快跑通"的临时方案**。
:::

### 第 1 步：装 Node.js

1. 去 [nodejs.org](https://nodejs.org) 下载 **LTS 版**（`.msi` 文件）
2. 双击安装，**一路 Next 默认就行**——⚠️ 注意安装界面默认勾选的 `Add to PATH` **不要取消**
3. 装完打开**新的** PowerShell（旧的窗口读不到新 PATH）：
   ```powershell
   node --version    # 应输出 v22.x.x 或类似
   npm --version
   ```

### 第 2 步：装 Codex

国内用户先换镜像：

```powershell
npm config set registry https://registry.npmmirror.com
npm install -g @openai/codex
codex --version
```

### 第 3 步：装 Git for Windows（必装）

Codex 需要 Git。装 Git for Windows 顺便就有了 Git Bash（一个迷你 Unix shell，能跑大部分 Shell 命令）：

1. 下载 [Git for Windows](https://git-scm.com/downloads/win)
2. 双击安装，**一路 Next 默认就行**——确认勾上 `Add Git to PATH`
3. 装完打开**新的** PowerShell：
   ```powershell
   git --version    # 应输出 git version 2.x.x
   ```

::: tip 遇到 Shell 命令报错可以切到 Git Bash
开始菜单找 **Git Bash** 打开，跟 Linux 终端体验更像。然后在 Git Bash 里跑 `codex`，兼容性更好。
:::

### 第 4 步：配模型

参考 [认证与 API Key](/codex/guide/authentication)。Windows 设环境变量：

```powershell
# 永久（重开 PowerShell 生效）
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-xxxx", "User")

# 或者写 config.toml（更推荐）
notepad $env:USERPROFILE\.codex\config.toml
# 文件里粘贴前面的 [model] 配置
```

---

## 推荐：VS Code + WSL 插件

如果你装了 WSL2，强烈建议配 VS Code，体验最佳：

1. 装 [VS Code](https://code.visualstudio.com/)
2. 在 VS Code 装 **WSL 扩展**（搜 `ms-vscode-remote.remote-wsl` 或 "WSL"）
3. 在 Ubuntu 终端进入项目目录跑：
   ```bash
   code .
   ```
   VS Code 自动启动并连到 WSL，文件用 Linux 路径浏览
4. VS Code 内置终端按 `Ctrl + ~` 打开，里面跑 `codex`

---

## 常见问题

### Q：`wsl --install` 报错 "0x80370102"

CPU 虚拟化没开。回去看 [前置：确认电脑支持](#前置-确认你的电脑支持) 进 BIOS 开。

### Q：WSL2 装好了但 Ubuntu 不弹

```powershell
# 手动启动
wsl

# 或重启整个 WSL
wsl --shutdown
wsl
```

### Q：WSL2 里 `npm install` 卡住 / DNS 失败

```bash
# 检查 DNS
cat /etc/resolv.conf

# 临时换 DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# 永久禁用 WSL 自动生成 resolv.conf（建议）
sudo nano /etc/wsl.conf
# 加入：
[network]
generateResolvConf = false
# Ctrl+X 保存，重启 wsl: wsl --shutdown
```

### Q：在 WSL 里跑 `code .` 提示找不到命令

VS Code 没装 WSL 扩展，或者没在 Windows 上装 VS Code。先装 [VS Code](https://code.visualstudio.com/)，然后装 `Remote - WSL` 扩展。

### Q：Windows 上路径有中文 / 空格，Codex 报错

WSL 路径里有中文一般没事；**空格**要用引号包：
```bash
cd "/mnt/c/Users/Tom/My Documents/my-project"
```

### Q：用 PowerShell 跑 Codex，某些命令报错

切换到 Git Bash 跑——开始菜单找 **Git Bash** 打开，里面跑 `codex` 兼容性更好。

### Q：怎么从 PowerShell 模式切到 WSL2 模式

直接装 WSL2 即可，两者不冲突。装完之后用 WSL2 跑 Codex 就行——原 PowerShell 上的 Codex 留着也不影响。

---

## 推荐：Windows Terminal

[Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701) 是微软官方出品的现代终端，比默认 CMD / PowerShell 体验好很多：

- 多标签（一个窗口开多个 shell）
- WSL2 / PowerShell / CMD / Git Bash 在同一窗口切换
- 字体渲染好，Codex 的 TUI 界面显示更完整
- 完全免费

在微软商店搜「Windows Terminal」装上即可。

---

## 下一步

WSL2 装好后回到主线：
- 🚀 [快速开始](/codex/guide/quick-start)
- 🇨🇳 [国内模型对接](/codex/china-models/overview)
- 🔑 [认证与 API Key](/codex/guide/authentication)
