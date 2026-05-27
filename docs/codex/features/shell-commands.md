# 7. Shell 命令执行

> **本文你将学会：** Codex 怎么执行终端命令、哪些自动跑 / 哪些会问你、工作目录的概念、安全注意事项。

::: info Shell 命令是什么？
"Shell 命令" 就是你在终端 / PowerShell / Git Bash 里输入的那些命令——`ls`、`npm install`、`git diff` 都是。

Codex 能"代你跑这些命令"——比如你说"运行测试看看哪里挂了"，它会**自己**执行 `npm test`、读出错信息、定位代码、改完再跑一次验证。
:::

## Codex 能做什么

Codex 不只能改代码，还能直接执行 Shell 命令。这让它可以：

- 运行测试并根据结果修复代码
- 安装依赖包（`npm install` / `pip install`）
- 编译、构建项目
- 执行数据处理脚本
- 操作 git（commit / diff / log）

## 命令执行示例

### 示例 1：运行并修复测试

```
运行 npm test，如果有失败的测试，帮我修复代码直到全部通过
```

Codex 会：
1. 执行 `npm test`
2. 读取错误输出
3. 定位到失败的代码
4. 修改代码
5. 再次运行测试验证

### 示例 2：安装并配置依赖

```
安装 axios 和 lodash，并在 src/api.js 中用 axios 替换现有的 fetch 调用
```

### 示例 3：批量文件操作

```
找出 src 目录下所有超过 200 行的 .js 文件，列出文件名和行数
```

## ⭐ 哪些命令自动跑、哪些会问你

Codex 在 **Auto 模式**（默认）下，按"风险等级"决定是不是问你：

::: tip 自动执行（无需确认）
- 📖 **读取类**：`cat` / `ls` / `find` / `grep` / `head` / `tail` / `wc`
- 🧪 **测试类**：`npm test` / `pytest` / `cargo test` / `go test`
- 📦 **包管理（项目级）**：`npm install` / `pip install` / `cargo build`
- 🌿 **git 安全操作**：`git status` / `git diff` / `git log` / `git add` / `git commit`
- 🔨 **构建编译**：`npm run build` / `tsc` / `make`
:::

::: warning 始终需要确认
- 🗑 **删除**：`rm` / `rmdir` / 各种 `delete`
- 🌐 **网络请求**：`curl` / `wget` / `ssh`
- 🔧 **修改系统配置**：`sudo *` / 改 `/etc/*` / 改 `.bashrc` / 改 `crontab`
- 🚀 **写远端 git**：`git push` / `git push --force`
- 💣 **不熟悉的命令**：Codex 没见过的命令名（避免意外）
- 🌍 **跨目录操作**：访问当前 Codex 启动目录之外的文件
:::

::: warning 永远不会自动跑
- `rm -rf /` 这种明显毁灭性的
- 写文件系统挂载点（`mount` / `umount`）
- 格式化磁盘（`mkfs.*`）
:::

具体哪些自动哪些不自动取决于权限模式，详见 [Agent 权限模式](/codex/features/agent-modes)。

## 命令执行的工作目录

::: info 什么是"工作目录"？小白必看
你跑 `npm install`，npm 会根据**当前你所在的目录**找 `package.json`。换句话说，**命令在哪儿跑、它就只看那个目录里的东西**。

Codex 也一样——它跑命令的目录 = 你启动它时所在的目录。

**绝对路径 vs 相对路径**：
- 绝对路径：从根目录写起，`/Users/me/my-project/src/index.js`，到哪儿都能找到
- 相对路径：相对于"当前工作目录"，`./src/index.js`、`../config/x.toml`
:::

```bash
# 例：你在 ~/my-project 启动 Codex
cd ~/my-project
codex

# Codex 跑的所有命令默认工作目录 = ~/my-project
# 它跑 `cat package.json` 实际是 `cat ~/my-project/package.json`
```

::: warning Codex 不会主动 cd
Codex **不会**因为你说"在 packages/api 装依赖"就自动 `cd packages/api`。

要么：
- **明确说**："在 packages/api 目录下运行 `npm install`"——Codex 会 `cd packages/api && npm install`
- 或者**启动时就进对的目录**：
  ```bash
  cd packages/api
  codex
  ```
:::

## 命令前 Codex 会展示什么

执行前你会看到类似：

```
即将执行：npm install axios --save
   工作目录：/Users/me/my-project
   预期效果：安装 axios 并加入 package.json 的 dependencies
确认执行？[Y/n]
```

按 `Y` / 回车通过、按 `N` 拒绝。

::: tip 一次性同意多个相关操作
Codex 经常一连跑几个相关命令（`npm install` → `npm test` → 改代码 → 再 `npm test`）。
- **每次都问太烦** → 切到 Auto 模式（默认就是）
- **批量信任一类操作** → [配置权限白名单](/codex/features/agent-modes#在-config-toml-中设置默认模式)
:::

## 查看 Codex 跑过哪些命令

所有 Codex 执行过的命令都会显示在会话 UI 中。退出 Codex 后还想看：

```bash
# Shell 历史
history | grep -E "npm|git|python"

# 看 Codex 的会话日志（如果保存了）
cat ~/.codex/sessions/最新一次.log
```

## 实用场景

### 场景 1：CI/CD 验证（提交前自动检查）

```
运行以下检查，如果有问题请修复：
1. npm run lint
2. npm run typecheck
3. npm test
确保三个命令全部通过
```

Codex 会顺序跑这三步，每步失败就修代码，直到全过。

### 场景 2：项目初始化

```
帮我用 create-react-app 创建一个新的 TypeScript 项目，
项目名叫 my-dashboard，
然后安装 react-query 和 tailwindcss，
并完成 tailwindcss 的初始配置
```

### 场景 3：数据处理

```
在当前目录有一个 data.csv 文件，
帮我写一个 Python 脚本统计每列的缺失值数量并输出报告，
然后运行这个脚本
```

## 安全建议

::: warning 几条铁律
1. **务必在 git 仓库里用 Codex** —— 任何意外都能 `git checkout .` 回滚
2. **看到 `rm` / `sudo` / 写远端时再三确认** —— 别盲点 Y
3. **不熟悉的项目先用 [只读模式](/codex/features/agent-modes)** —— 先看再说，别让 AI 自由动手
4. **永远不要在生产服务器上跑 Codex** —— 用本地 / 测试环境
:::

## 下一步

- 🔐 [Agent 权限模式](/codex/features/agent-modes) — 三种模式怎么选
- 📝 [AGENTS.md 自定义指令](/codex/advanced/agents-md) — 让 Codex 记住项目规范
- 📄 [文件编辑功能](/codex/features/file-editing) — Codex 怎么读写文件
