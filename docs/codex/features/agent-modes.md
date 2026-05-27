# 5. Agent 权限模式

> **本文你将学会：** Codex 三种权限模式各是什么、什么场景该用哪种、怎么切换、为什么有这种设计。

::: tip 30 秒决策
| 你的场景 | 选 |
|---|---|
| 日常开发，自己的项目 | **🟢 Auto**（默认） |
| 看不熟的代码 / 别人的开源项目 | **🟡 只读** |
| 一次性脚本 / Docker 沙盒 | **🔴 完全访问** |
| 不确定 | 🟢 Auto，遇到不安全的它会问你 |
:::

## 为什么需要权限模式

::: info 一句话理解
Codex 不只是"聊天 AI"——它能**读你电脑上的文件、改文件、跑命令、上网**。

如果完全放开，它理论上可以：
- 删错文件
- 改坏你的配置
- 调用付费 API 烧钱
- 上传敏感代码到外部

权限模式 = 让你**精确控制 AI 的"活动范围"**。在效率（少弹窗）和安全（不闯祸）之间找平衡。
:::

## 三种模式详解

### 🟢 Auto 模式（默认）

**适合**：日常开发，在自己的项目目录内工作。

行为：

| 操作 | Auto 模式 |
|---|---|
| 📖 读取当前目录的文件 | ✅ 自动执行 |
| ✏️ 修改当前目录的文件 | ✅ 自动执行 |
| 🧪 跑测试 / build / lint | ✅ 自动执行 |
| 🌿 git 安全操作（status / diff / commit） | ✅ 自动执行 |
| 🌐 网络请求（curl / wget） | ❓ 需确认 |
| 📁 访问当前目录之外的文件 | ❓ 需确认 |
| 🗑 删除文件 / `rm` | ❓ 需确认 |
| 🔧 `sudo` / 改系统配置 | ❓ 需确认 |
| 🚀 `git push` / `git push --force` | ❓ 需确认 |

```bash
# 默认就是 Auto 模式
codex

# 显式指定
codex --approval-mode auto
```

::: tip 想象一下："如果用 Auto 模式，Codex 会不会突然删我文件？"
**不会**——`rm` / `sudo` / 跨目录都会弹窗问你。即使 Codex 写了"我想跑 `rm -rf /`"，它也会**先**问你"允许吗"，**你必须按 Y 它才真的执行**。

最差情况：Codex 改坏当前目录的某个文件——这时候 `git checkout .` 一键回滚就行（前提是你 `git init` 了）。
:::

### 🟡 只读模式（Read-Only）

**适合**：代码审查、理解陌生代码库、不想让 AI 改任何东西的探索。

行为：

| 操作 | 只读模式 |
|---|---|
| 📖 读取文件 | ✅ 自动 |
| ✏️ 修改文件 | ❓ 需确认 |
| 🧪 执行命令（包括跑测试） | ❓ 需确认 |
| 🌐 网络请求 | ❓ 需确认 |

```bash
codex --approval-mode read-only
```

::: tip 典型用法
```bash
# 1. 进入一个陌生的开源项目
cd ~/Downloads/some-open-source-project
git init  # 万一这项目没有 git

# 2. 启动只读模式
codex --approval-mode read-only

# 3. 提问，Codex 只能读、不能改
帮我梳理整个 src 目录的模块结构，画出依赖关系
解释 middleware/auth.js 的验证逻辑
找出所有用了 jQuery 的文件，按修改时间排序
```

读懂了再切回 Auto 模式动手——按 `/mode auto` 即可。
:::

### 🔴 完全访问模式（Full Access）

**适合**：你**明确信任**当前环境（如 Docker 沙盒、一次性虚拟机），想让 Codex 高度自主完成复杂任务。

行为：

| 操作 | 完全访问 |
|---|---|
| 📖 读写任意文件 | ✅ 自动 |
| 🧪 执行任意命令 | ✅ 自动 |
| 🌐 网络请求 | ✅ 自动 |
| 🗑 `rm` / `sudo` | ✅ 自动 |

```bash
codex --approval-mode full
```

::: danger 完全访问模式 ⚠️ 高风险
**只在以下场景用**：
1. ✅ **隔离的 Docker 容器 / 一次性虚拟机** —— 哪怕 Codex 删干净也无所谓
2. ✅ **完全信任的私有仓库** + git clean —— 跑歪了能完整回滚
3. ✅ **一次性脚本任务** —— 跑完就退出

**绝对不要**：
- ❌ 在你的主力开发机直接开
- ❌ 在 SSH 连接的生产服务器上开
- ❌ 在挂了重要数据的目录开
:::

## 模式对比一张表

| 功能 | Auto 🟢 | 只读 🟡 | 完全访问 🔴 |
|------|:----:|:----:|:--------:|
| 读当前目录文件 | 自动 | 自动 | 自动 |
| 写当前目录文件 | 自动 | 需确认 | 自动 |
| 执行常规 Shell 命令 | 自动 | 需确认 | 自动 |
| 跑测试 / build | 自动 | 需确认 | 自动 |
| 读其他目录文件 | 需确认 | 需确认 | 自动 |
| 网络请求 | 需确认 | 需确认 | 自动 |
| `rm` / `sudo` | 需确认 | 需确认 | 自动 |
| 适合谁 | 日常开发 | 探索陌生代码 | 沙盒环境 |

## 切换模式

### 启动时指定

```bash
codex --approval-mode read-only
codex --approval-mode auto
codex --approval-mode full
```

### 会话中临时切

```
/mode read-only
/mode auto
/mode full
```

切换立即生效，下次启动还原默认。

### 自然语言降级

也可以**在对话里告诉它**降低权限——虽然不严格，但 Codex 通常会遵守：

```
这次只需要分析代码，不要做任何修改
```

::: warning 自然语言不如 /mode 严格
如果你**真的**不希望 Codex 动文件，**用 `/mode read-only`**——它在 OS 层面拦截，比"靠 Codex 自觉"可靠得多。
:::

### 在 config.toml 中设默认

```toml
# ~/.codex/config.toml
[agent]
approval_mode = "auto"  # auto / read-only / full
```

详见 [配置文件详解](/codex/config/config-basic#agent)。

## 不同场景推荐模式

| 场景 | 推荐模式 | 理由 |
|------|----------|------|
| 第一次接触 Codex | 🟡 只读，先看它怎么思考 | 别一上来就让它动文件，先观察一阵 |
| 自己项目日常开发 | 🟢 Auto | 平衡安全和效率 |
| 全量重构复杂模块 | 🟢 Auto（确保 `git status` clean） | 出错能回滚 |
| 审查同事代码 | 🟡 只读 | 你的目的就是看，不该改 |
| 在受信任 CI 自动化 | 🔴 完全访问 | 隔离环境，无需弹窗 |
| 探索陌生开源项目 | 🟡 只读 | 不熟的代码，先理解再动 |
| 一次性数据处理脚本 | 🟢 Auto 或 🔴 完全 | 都行 |
| 生产服务器（不推荐） | ❌ 别用 Codex | 用专门的运维工具 |

## 排错速查

### Q：我设了 Auto，但每次跑 `npm install` 都问我？

可能是 Codex 没识别为"常用包管理命令"——尤其是非英文项目目录。在 [配置文件](/codex/config/config-basic) 里加白名单：

```toml
[agent]
approval_mode = "auto"
auto_approve = ["npm install*", "npm test*", "git diff*"]
```

### Q：只读模式下 Codex 还是想修改文件

它**可以建议**改、但**不会真改**——所有 Edit / Write 操作都会被卡住等你确认。你看到的"它要改"是建议，按 N 拒绝就行。

### Q：误开了完全访问模式，怎么尽快恢复安全

```
/exit                           # 退出会话
codex --approval-mode auto      # 重启到默认
```

或者编辑 `~/.codex/config.toml` 把 `approval_mode` 改回 `auto`。

## 下一步

- 🔧 [Shell 命令执行](/codex/features/shell-commands) — 详细看 Codex 跑什么命令
- 📝 [AGENTS.md 自定义指令](/codex/advanced/agents-md) — 让 Codex 记住项目规范
- ⚙️ [config.toml 基础配置](/codex/config/config-basic) — 持久化你的偏好
