# 11. 权限与模式

::: info 本章你将学到
- Claude Code 的权限设计哲学（安全 vs 便利的权衡）
- 5 种权限模式在 **安全 × 便利** 矩阵中的位置
- 怎么挑模式（按场景对号入座）
- 精细控制：`/permissions` + `settings.json` + CLI 参数
- **新装的人推荐的"必加白名单"模板**
- 自动生成白名单 + 沙盒模式（高级）
:::

## 11.1 权限设计哲学

Claude Code 的设计原则是「**默认安全、可逐步放开**」：
- 默认每个"会改东西"的操作（写文件、跑 Bash、调 MCP）都先问一次
- 你信任的可以加进白名单，以后不问
- 你绝对不想让 AI 做的可以加进黑名单（如 `rm -rf`）

::: warning AI 不是不犯错——是会"想错"
即使最聪明的模型也可能误判：把测试用的 SQL `DROP TABLE` 当成清理操作真跑了；把要 backup 的目录当临时目录删了。**权限系统是你的安全网，不是麻烦**。
:::

## 11.2 五种权限模式（安全 × 便利 矩阵）

```
                  ← 更便利 / 弹窗少                 更安全 / 弹窗多 →

bypassPermissions ← auto ← acceptEdits ← default ← plan
   (跳过所有)      (智能)   (自动编辑)    (默认)   (只读)

   ⚠️ 危险        🤖 大胆     ✅ 适合      🔒 严谨    👀 探索
```

| 模式 | 改文件 | 跑 Bash | 适合谁 / 何时 |
|---|---|---|---|
| **`plan`** | ❌ | ❌ | 探索代码、画方案、不想动手 |
| **`default`**（默认） | 每次问 | 每次问 | 不熟的代码 / 生产仓库 |
| **`acceptEdits`** | ✅ 自动 | 每次问 | 你信任的编辑任务（重构、改 UI 等） |
| **`auto`** | ✅ 智能 | 智能判断 | 长任务、批量改动，相信 Claude 不会瞎搞 |
| **`bypassPermissions`** | ✅ 全放 | ✅ 全放 | ⚠️ 沙盒 / 隔离容器 / 一次性脚本 |

::: tip 不知道选哪个？
- **第一周用 Claude Code**：留在 `default`，慢慢建立信任 + 加白名单
- **熟练后日常用**：`acceptEdits`，编辑不烦你、Bash 还是问
- **大批量改动**：`auto`，主要操作放开、危险的还问
:::

### 切换模式

```bash
# 方式 1：启动时
claude --permission-mode plan

# 方式 2：会话中按 Shift+Tab 循环
# 状态栏会显示当前模式

# 方式 3：会话中输入斜杠命令
/plan         # 进入 plan
/edit-mode    # 进入 acceptEdits
```

::: danger bypassPermissions 真的很危险
`bypassPermissions` 和 `--dangerously-skip-permissions` 让 Claude 可以**自由跑任何命令**，包括 `rm -rf /`、`git push --force`、`DROP DATABASE`。

**安全使用前提**（全部满足才能开）：
- 在隔离的 Docker 容器或一次性虚拟机
- 仓库是测试用、丢了无所谓
- 没接生产数据库、没 push 权限

否则**用 `auto` 替代**——99% 的便利 + 危险操作仍然问你。
:::

## 11.3 精细权限控制

### 会话中即时改：`/permissions`

```
/permissions
```

打开权限管理界面，加入规则：

```
allow: Bash(npm run lint)      # 允许这条具体命令
allow: Bash(git commit *)      # 允许所有 git commit *
allow: Bash(git diff *)        # 允许所有 git diff *
allow: Read                    # 允许所有读操作
allow: Write                   # 允许所有写操作
ask:   Edit                    # Edit 还是要问（推翻默认放行）
deny:  Bash(rm -rf *)          # 永远拒绝
deny:  Bash(sudo *)            # 永远拒绝 sudo
```

### 通配符规则

| 写法 | 匹配 |
|---|---|
| `Bash(git *)` | 所有以 `git ` 开头的命令 |
| `Bash(git:*)` | 同上（: 形式，效果等价）|
| `Bash(npm run *)` | 所有 `npm run` 命令 |
| `Bash(rm -rf *)` | 所有 `rm -rf` 命令 |
| `Bash(*)` | 任何 Bash 命令（**别配 allow**） |

::: tip allow / deny 的优先级
**deny 永远胜过 allow**。即使你 `allow: Bash(*)` 又 `deny: Bash(rm -rf *)`，rm -rf 仍然被拒。
:::

## 11.4 持久化到 settings.json

`/permissions` 只对当前会话有效。要每次启动都生效，写进 `~/.claude/settings.json` 或项目 `.claude/settings.json`：

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm run *)",
      "Bash(npx prettier *)",
      "Read",
      "Write"
    ],
    "deny": [
      "Bash(sudo *)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(DROP *)",
      "Bash(mkfs *)"
    ]
  }
}
```

### 新装的人推荐的"必加白名单模板"

把这一段直接复制进 `~/.claude/settings.json`，立刻减少 80% 弹窗：

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git show *)",
      "Bash(git stash list)",
      "Bash(npm test *)",
      "Bash(npm run lint *)",
      "Bash(npm run typecheck *)",
      "Bash(node --version)",
      "Bash(python --version)",
      "Read",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(sudo *)",
      "Bash(rm -rf *)",
      "Bash(rm -rf /)",
      "Bash(rm -rf ~)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)",
      "Bash(DROP DATABASE *)",
      "Bash(DROP TABLE *)",
      "Bash(mkfs *)"
    ]
  }
}
```

**这个模板的设计原则**：
- **允许的全是只读 / 不改远端的命令**（git status / diff / log 都是看，不动）
- `npm test` / `lint` / `typecheck` 等本地脚本放行
- `Read / Glob / Grep` 都是只读工具，全放
- `Edit` / `Write` 不放——改文件还是问一下更稳
- `Bash(npm run *)` 不全放——你的 npm script 可能有 `deploy`、`db:reset`，不安全

## 11.5 自动生成白名单

不知道该允许哪些？让 Claude 帮你扫描历史：

```
/fewer-permission-prompts
```

它会：
1. 分析你历次会话中**批准过哪些命令**
2. 找出高频被你"放行"的命令模式
3. 自动生成 `allow` 列表加进 settings.json
4. 让你确认后写入

**大幅减少以后的弹窗**。建议用了 1-2 周后跑一次。

## 11.6 沙盒模式（`/sandbox`）

在支持的系统（macOS Seatbelt、Linux seccomp）上，沙盒提供**操作系统级隔离**：

```
/sandbox        # 开关沙盒模式
```

开启后：
- 文件系统访问受限（只能访问被允许的目录）
- 网络访问受限
- 在边界内 Claude 可以自由工作而**不需要频繁询问**

::: tip 沙盒最适合：长时间自动化任务
你设好边界 + 跑 `bypassPermissions`，让 Claude 在沙盒里跑一夜的批量改动，不用频繁确认，也不用担心它越界把别的项目搞坏。
:::

## 11.7 CLI 参数控制权限

```bash
# 预批准特定工具
claude --allowedTools "Bash(git *) Read Write"

# 禁用特定工具
claude --disallowedTools "Bash(rm *)"

# 只允许白名单工具
claude --tools "Read,Grep,Glob"

# 进入只读计划模式
claude --permission-mode plan

# 危险：跳过所有权限确认（沙盒里用）
claude --dangerously-skip-permissions
```

## 11.8 排错速查

### Q：明明加了白名单，每次还问

可能是：
1. **写错位置** —— 是 `~/.claude/settings.json`（不是 `~/.claude.json`）
2. **被项目级覆盖** —— 项目根 `.claude/settings.json` 优先级高，可能那里没设
3. **JSON 格式错** —— 漏逗号 / 引号，整段 permissions 没被加载，用 [jsonlint.com](https://jsonlint.com/) 验

跑 `claude doctor` 看实际生效配置。

### Q：deny 加了 `Bash(rm -rf *)`，Claude 还是想跑

不可能——`deny` 是硬阻拦。如果"看起来还是被跑了"，可能：
- Claude 跑的是别的等价命令（`find . -delete`），而 deny 没覆盖
- Claude 在主动**请求**跑（弹窗），你点了允许

`deny` 列表想稳，加一组组合：
```json
{
  "deny": [
    "Bash(rm -rf *)",
    "Bash(find * -delete)",
    "Bash(find * -exec rm *)"
  ]
}
```

### Q：误开了 `bypassPermissions`，怎么尽快恢复安全

```
/exit                          # 退出会话
claude --permission-mode default   # 重新启动到默认模式
```

或编辑 `~/.claude/settings.json` 把 `defaultMode` 改回 `default`。

---

## 看完这一章你应该知道

✅ 5 个模式按"安全 ↔ 便利"排：`plan` → `default` → `acceptEdits` → `auto` → `bypassPermissions`
✅ 新用户从 `default` 起步，熟了切 `acceptEdits`，长任务 `auto`
✅ `bypassPermissions` 只在隔离环境用，**别在生产仓库开**
✅ 复制 11.4 的"必加白名单模板"减少 80% 弹窗
✅ 用一阵子后跑 `/fewer-permission-prompts` 自动生成个人化白名单
✅ `deny` 永远胜过 `allow`，不会被覆盖

---

**下一步**：[12. 计划模式 →](/claude-code/advanced/plan-mode)
