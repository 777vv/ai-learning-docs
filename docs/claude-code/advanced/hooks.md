# 15. 钩子（Hooks）

::: info 本章你将学到
- Hooks 是什么、和 CLAUDE.md / Skill 的关键区别
- 5 分钟跑通你的第一个 Hook（保存自动格式化）
- 11 种钩子事件类型 + 触发时机速查
- 4 种钩子类型（command / http / prompt / agent）
- 用钩子拦截危险命令、自动通知、提交前跑测试
- 钩子的环境变量参考
- 钩子不工作时怎么排查
:::

## 15.1 Hooks 解决什么问题

::: tip 三件套快速对比
| | 谁触发 | 执行强度 | 适合场景 |
|---|---|---|---|
| **CLAUDE.md** | 自动（每次会话） | "建议"，Claude 可能不照做 | 项目常识、规范说明 |
| **Skill** | 用户调用 / 自动识别 | "建议"，Claude 按工作流走 | 复用的复杂任务模板 |
| **Hook** | 事件触发（系统强制） | **"强制"，一定会跑** | 自动化动作、安全拦截 |
:::

**Hook 解决什么？** 当你需要保证某件事**一定发生**，不能依赖 Claude 的判断——比如「写完文件一定要格式化」「绝对不能跑 `rm -rf`」「发 commit 前一定跑测试」——这些就是 Hook 的位置。

典型用法：
- 每次 Write / Edit 后自动跑 prettier
- 拦截 Bash 里的 `rm -rf` / `git push --force`
- Claude 跑完 commit 前自动跑测试
- 会话结束后给 Slack 发通知

## 15.2 5 分钟跑通你的第一个 Hook

我们做最实用的：**Claude 改文件后自动跑 Prettier 格式化**。

### 前置：装好 Prettier

```bash
# 项目里装（在项目根目录）
npm install --save-dev prettier

# 或全局装
npm install -g prettier
```

确认能跑：
```bash
npx prettier --version
# 应该输出版本号
```

### 第 1 步：写配置

打开（没有就新建）`.claude/settings.json`（项目级）或 `~/.claude/settings.json`（个人全局）：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE_PATH\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**逐行解读**：
- `PostToolUse` —— 在某个工具调用**成功之后**触发
- `matcher: "Write|Edit"` —— 只对 Write 或 Edit 工具触发（其他工具如 Bash / Read 不触发）
- `type: "command"` —— Hook 类型是"跑 shell 命令"
- `command` —— 实际执行的命令，`$FILE_PATH` 是 Claude Code 自动注入的"刚被改的文件路径"
- `timeout: 30` —— 30 秒内没跑完算超时

### 第 2 步：重启会话让 Hook 生效

```bash
# 退出当前会话
/exit

# 重新进
claude
```

::: warning 改 settings.json 必须重启
Claude Code 启动时一次性加载 hooks，运行中改了文件**不会自动重新加载**。
:::

### 第 3 步：验证 Hook 跑起来了

让 Claude 改一个文件，比如：

```
你：把 src/index.js 里 console.log 改成 console.warn
```

Claude 改完文件后，**Prettier 会被自动调用**——你可能会注意到代码格式被同步修整（比如缩进、引号风格被规范化）。

如果想确认 Hook 真的跑过，加个调试输出：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[Hook 跑了] $FILE_PATH\" >> /tmp/claude-hook.log && npx prettier --write \"$FILE_PATH\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

跑一下 `tail -f /tmp/claude-hook.log`，每次 Claude 写文件你都能看到一行日志。

🎉 **第一个 Hook 跑通了**。继续看 11 种事件类型，挑你需要的接进来。

## 15.3 钩子事件类型

| 事件 | 触发时机 | 常用场景 |
|------|---------|---------|
| `SessionStart` | 会话开始或恢复 | 加载环境变量、打印欢迎信息 |
| `SessionEnd` | 会话结束 | 发通知、归档日志 |
| `UserPromptSubmit` | 用户提交 prompt 之前 | 日志记录、敏感词检查 |
| `PreToolUse` | 工具调用**之前**（**可以阻止**！）| 危险命令拦截、权限检查 |
| `PostToolUse` | 工具调用**成功后** | 自动格式化、自动测试 |
| `PostToolUseFailure` | 工具调用**失败后** | 错误上报、重试机制 |
| `Stop` | Claude 回答完毕 | 桌面通知、追踪记录 |
| `PreCompact` / `PostCompact` | 上下文压缩前后 | 归档上下文、统计 |
| `Notification` | Claude 发出通知 | 转发到外部 IM |
| `FileChanged` | 监视的文件发生变化 | 自动重载、构建触发 |
| `SubagentStart` / `SubagentStop` | 子代理启动/结束 | 子代理追踪 |

**最常用的两个**：
- **`PostToolUse`** —— "Claude 干完事我跟一下" → 格式化、测试
- **`PreToolUse`** —— "Claude 想干这事我把把关" → 拦截危险

## 15.4 基础配置结构

```json
{
  "hooks": {
    "<事件名>": [
      {
        "matcher": "<工具名或模式>",
        "hooks": [
          {
            "type": "command",
            "command": "要执行的命令",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**关键点**：
- `<事件名>` 用 15.3 表里的事件名
- `matcher` 是**工具名**或 **glob 模式**（如 `Write|Edit`、`Bash`、`Bash(git commit *)`）
- 同一事件可以有多个 matcher、每个 matcher 可以有多个 hooks
- `timeout` 单位是**秒**

## 15.5 更多实用示例

### 示例 1：拦截危险的删除命令

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm -rf *)",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous.sh"
          }
        ]
      }
    ]
  }
}
```

新建 `.claude/hooks/block-dangerous.sh`：

```bash
#!/bin/bash
# 通过标准输出返回 JSON 来阻止工具调用
# Claude Code 会读这个 JSON 决定要不要让命令跑

jq -n '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: "禁止 rm -rf。如果真的要删，自己手动跑。"
  }
}'
```

设执行权限：

```bash
chmod +x .claude/hooks/block-dangerous.sh
```

::: warning 不会写 shell 脚本？让 Claude 帮你写
```
我想要一个 Hook：拦截 Claude 跑 sudo 命令，给个友好提示。帮我写 hook 配置和脚本。
```
Claude 能直接生成 settings.json 和 .sh 文件。
:::

### 示例 2：会话结束后发 Slack 通知

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/xxx/yyy/zzz",
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": "{\"text\": \"Claude Code 会话结束: $SESSION_ID\"}"
          }
        ]
      }
    ]
  }
}
```

`type: "http"` 适合不想写脚本、直接打第三方 webhook 的场景（飞书机器人、Discord webhook 也都行）。

### 示例 3：commit 前强制跑测试

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit *)",
        "hooks": [
          {
            "type": "command",
            "command": "npm test -- --passWithNoTests",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

如果 `npm test` **退出码非 0**（测试失败），Hook 视为失败，**Claude Code 会阻止 commit**。

### 示例 4：自动跑 ESLint + 失败也不报错（fail-soft）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix \"$FILE_PATH\" 2>/dev/null || true",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

`|| true` 兜底——ESLint 报错也不影响 Claude 继续干活。

## 15.6 四种钩子类型

| 类型 | 何时用 | 关键参数 |
|------|------|------|
| **`command`** | 跑本地 shell 脚本（最常用） | `command` / `timeout` |
| **`http`** | 调远程 API（如 Slack / 飞书 webhook） | `url` / `method` / `headers` / `body` |
| **`prompt`** | 把事件数据发给 Claude，让它判断是/否 | `prompt`（让 LLM 决策的提示词） |
| **`agent`** | 启动子代理做复杂验证 | `agent`（要跑的 subagent 配置） |

入门只用 **`command`** 和 **`http`** 就够了。`prompt` / `agent` 是高级用法（用 AI 判断 hook 该不该放行）。

## 15.7 Hook 可用的环境变量

写 command 类型的 hook 时，这些变量会自动注入：

| 变量 | 内容 | 例子 |
|------|------|------|
| `$FILE_PATH` | 被操作的文件路径（Write/Edit 事件） | `/Users/me/src/index.js` |
| `$CLAUDE_PROJECT_DIR` | 当前项目根目录 | `/Users/me/myproject` |
| `$SESSION_ID` | 当前会话 ID | `sess_xxx` |
| `$TOOL_NAME` | 触发钩子的工具名 | `Write` / `Edit` / `Bash` |
| `$TOOL_INPUT` | 工具的输入参数（JSON 字符串） | `{"file_path":"...","content":"..."}` |

Hook 脚本也可以**通过 stdin 收到完整的事件 JSON**——里面有更详细的字段。

## 15.8 管理钩子

```
/hooks          # 在会话内查看所有已加载的 hook
```

**临时禁用所有钩子**（调试时有用）：

```json
{
  "disableAllHooks": true
}
```

或加命令行参数：
```bash
claude --disable-hooks
```

## 15.9 排错速查

### Q：配置写了，hook 没跑

检查清单：
1. **重启 Claude Code 了吗？** —— settings.json 改了必须重启会话
2. **JSON 格式对吗？** —— 漏逗号 / 引号会让整段 hooks 不加载，去 [jsonlint.com](https://jsonlint.com/) 验
3. **matcher 写对了吗？** —— `Write|Edit` 是工具名，`Bash` 也是工具名，**不是文件后缀**
4. **command 在终端能跑吗？** —— 复制 `command` 到终端手动跑一次，确认不报错
5. **写个 echo 验证一下** —— 在 command 前加 `echo "test" >> /tmp/test.log &&`，看日志有没有产生

### Q：hook 跑了但 Claude 没"知道"它失败了

`PreToolUse` 类 hook 想**阻止**Claude，必须按规范返回 JSON：

```bash
jq -n '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: "理由..."
  }
}'
```

直接 `exit 1` 不会让 Claude 知道——hook 失败和"不允许"是两件事。

### Q：Windows 用户 hook 脚本怎么写

Windows 没有原生 bash。两种办法：
1. **走 WSL2**：在 WSL 里跑 Claude Code，脚本就用 bash，跟 Mac/Linux 一样
2. **用 PowerShell / cmd**：`command` 字段写 PowerShell 命令
   ```json
   "command": "powershell -Command \"echo $env:FILE_PATH\""
   ```

### Q：超时了怎么办

`timeout` 默认 30 秒。跑 npm test 这种慢任务，记得调到 120 秒以上：

```json
{ "command": "npm test", "timeout": 300 }
```

### Q：让 Claude 帮我写 hook

```
我想要一个 hook：每次 Claude 修改 TypeScript 文件后，自动跑 tsc --noEmit 检查类型错误。
失败时让 Claude 知道哪里出错并修复。帮我写完整的 settings.json 配置和必要的 shell 脚本。
```

Claude 能自动生成配置和脚本。

---

## 看完这一章你应该知道

✅ Hook = 事件触发的**强制动作**，跟 CLAUDE.md（建议）和 Skill（工作流）区分
✅ 11 种事件，最常用 `PreToolUse`（拦截）和 `PostToolUse`（跟进）
✅ 4 种类型：`command`（脚本）/ `http`（webhook）/ `prompt` / `agent`
✅ 改 settings.json **必须重启会话**才生效
✅ Hook 用环境变量 `$FILE_PATH` / `$CLAUDE_PROJECT_DIR` 拿上下文
✅ 不工作就跑 `echo` 日志验证

---

**下一步**：[16. MCP 协议 →](/claude-code/advanced/mcp)

下一章看怎么用 MCP 给 Claude 连接外部数据源（数据库 / GitHub / Slack 等）。
