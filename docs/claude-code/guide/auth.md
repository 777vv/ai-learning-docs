# 4. 登录认证

::: info 本章你将学到
- 你该用哪种账号登录（按场景对号入座）
- OAuth 浏览器登录的完整流程 + 浏览器没弹的兜底办法
- Anthropic Console 申请 API Key 的逐步指引
- 多账号管理 / 切换 / 退出
- CI/CD 无头环境怎么用长效 Token
- 第三方云（Bedrock / Vertex）折叠为可选高级章节
:::

## 4.1 你该用哪种账号？

| 你的情况 | 推荐方式 | 看哪节 |
|---|---|---|
| 已经订阅 Claude Pro / Max / Team | **OAuth 浏览器登录** | [4.2](#_4-2-oauth-浏览器登录-订阅用户) |
| 想按量付费、做开发 | **Anthropic Console API Key** | [4.3](#_4-3-anthropic-console-api-key-按量付费) |
| 国内用户、想免翻墙 | **国内服务商 API Key**（硅基流动 / 智谱等） | [国内模型接入](/claude-code/china/models) |
| 公司在 AWS / GCP | Bedrock / Vertex | [4.6 高级](#_4-6-第三方云服务认证-高级) |
| 在 CI/CD 跑 Claude Code | **长效 Token** | [4.7](#_4-7-ci-cd-无头认证) |

::: tip 不知道选哪个？默认选这俩
- **想用最强模型 + 不想算 token 钱** → Claude Pro 订阅 + OAuth
- **想按用量付费、灵活控制** → Anthropic Console + API Key
:::

## 4.2 OAuth 浏览器登录（订阅用户）

适用：Claude Pro / Max / Team / Enterprise 订阅账号。

### 流程

```bash
# 第一次运行 claude 会自动引导，也可以手动触发：
claude auth login
```

终端会显示一段提示，类似：

```
打开浏览器完成登录：

  https://claude.ai/oauth/authorize?...&code=ABCD-1234

或访问 https://claude.ai/code-verify 并输入验证码：ABCD-1234

等待中...
```

### 浏览器自动弹出了

正常情况：浏览器自动打开 → 你登录 Claude 账号 → 点「授权」→ 终端那边自动收到完成消息 → ✅ 登录完成。

### 浏览器**没**弹出怎么办

最常见的几种情况和救场办法：

::: warning 救场办法
1. **手动复制 URL 到浏览器**：把终端里那段 `https://claude.ai/oauth/authorize?...` 整行复制到任意浏览器地址栏，回车
2. **复制验证码到 `claude.ai/code-verify`**：访问 [claude.ai/code-verify](https://claude.ai/code-verify)，把终端里的验证码（如 `ABCD-1234`）粘进去
3. **WSL 用户**：WSL 里跑 `claude` 不会弹 Windows 浏览器。手动复制 URL 到 Windows 浏览器登录就行
4. **SSH 远程服务器**：服务器上没浏览器，手动复制 URL 到你本地浏览器，登录完成后授权码会自动同步回服务器
:::

### 验证登录成功

```bash
claude auth status
```

应该输出类似：
```
✓ Logged in as you@example.com (Claude Pro)
```

## 4.3 Anthropic Console API Key（按量付费）

适用：想按 token 计费、不订阅订阅版的开发者。

### 第 1 步：注册 Anthropic Console

去 [console.anthropic.com](https://console.anthropic.com)：
1. 用邮箱注册（如果没账号）→ 收验证邮件
2. **充值**：第一次必须充值才能拿到能用的 Key——最低 5 美元，需要海外信用卡或 Wise 这类虚拟卡

::: warning 国内用户的难点
Anthropic Console 不接受国内信用卡。要么用 Wise / Revolut 虚拟卡、要么直接用 [国内服务商](/claude-code/china/models)（硅基流动等）省事很多。
:::

### 第 2 步：生成 API Key

1. Console 左侧菜单选 **API Keys**
2. 点右上角 **Create Key**
3. 起个名字（如 `claude-code-laptop`），点 Create
4. **复制出现的 `sk-ant-...` 串**——它**只显示一次**，关了就再也看不到

::: warning 立刻保存到环境变量
拿到 Key 立刻执行：

::: code-group

```bash [macOS / Linux]
# 临时（当前 shell）
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"

# 永久（推荐，写进 ~/.zshrc 或 ~/.bashrc）
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows PowerShell]
# 永久（用户级，重开 PowerShell 生效）
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-xxxxxxxxxxxx", "User")
```

:::

### 第 3 步：登录 Claude Code

```bash
claude auth login --console
```

它会读取 `ANTHROPIC_API_KEY` 环境变量，没读到才会让你粘贴。

## 4.4 认证管理命令

```bash
# 查看当前登录状态（包括账号、余额、模型可用性）
claude auth status

# 切换账号（重新登录会覆盖当前账号）
claude auth login

# 退出登录
claude auth logout
```

会话内的斜杠命令：
```
/login      切换账号
/logout     退出登录
/status     查看账号和连接状态
```

## 4.5 多账号管理

如果你既有个人 Pro、又有公司 Team 账号，或多个 API Key 想分开用：

### 方法 A：用项目级 settings.json 隔离

在某个项目里 `.claude/settings.json`：

```json
{
  "apiKey": "${WORK_ANTHROPIC_API_KEY}"
}
```

不同项目挂不同环境变量，互不干扰。

### 方法 B：用 shell alias

`~/.zshrc` 加：

```bash
alias claude-work='ANTHROPIC_API_KEY="$WORK_KEY" claude'
alias claude-home='ANTHROPIC_API_KEY="$HOME_KEY" claude'
```

跑 `claude-work` / `claude-home` 自动切到不同 Key。

## 4.6 第三方云服务认证（高级）

::: details Amazon Bedrock 完整步骤

```bash
# 方式一：环境变量（推荐 CI/CD 场景）
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
export ANTHROPIC_BEDROCK_BASE_URL="https://bedrock-runtime.us-east-1.amazonaws.com"

# 方式二：AWS CLI 配置文件
aws configure
claude auth login --bedrock
```

适用：公司已在 AWS、需要数据驻留 / 合规审计的场景。
:::

::: details Google Vertex AI 完整步骤

```bash
# 先用 gcloud 认证
gcloud auth application-default login

# 设置项目和区域
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_LOCATION="us-east5"
export ANTHROPIC_VERTEX_BASE_URL="https://us-east5-aiplatform.googleapis.com"

claude auth login --vertex
```

适用：公司已在 GCP、需要数据驻留 / 合规审计的场景。
:::

## 4.7 CI/CD 无头认证

GitHub Actions / Jenkins 等不能交互式登录浏览器。两种办法：

### 方法 A：直接用 API Key

```yaml
# .github/workflows/claude.yml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

steps:
  - run: claude -p "运行测试并报告结果" --output-format json
```

### 方法 B：用长效 Token（订阅账号专用）

订阅账号没有 API Key，需要先在本地生成长效 Token：

```bash
# 在本地（已登录状态）
claude setup-token

# 输出一个 sk-ant-... 形式的 token，复制
```

然后把这个 token 加进 CI 的 secrets：

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.CLAUDE_LONG_LIVED_TOKEN }}
```

::: warning 安全提示
- **绝对不要**把 API Key / 长效 Token 写进 commit
- 用 CI 平台的 secrets 管理（GitHub Secrets、Jenkins Credentials）
- 定期轮换 Token（建议 3 个月一次）
- 在 Console 里给每个 Key 设支出上限，防止泄露后被刷爆
:::

详见 [GitHub Actions 集成](/claude-code/integration/github-actions) 完整示例。

## 4.8 排错速查

### Q：`claude auth login` 一直转圈不动

- 浏览器没弹？看 [4.2 救场办法](#浏览器-没-弹出怎么办)
- 国内访问不到 claude.ai？[配置代理](/claude-code/china/proxy)
- 防火墙拦截？确认能 `curl https://claude.ai` 返回 200

### Q：登录后报「Unauthorized」

```bash
# 1. 看实际生效的认证来源
claude doctor

# 2. 清除残留登录信息重新来
claude auth logout
claude auth login
```

### Q：明明充值了但提示 quota 不够

去 [console.anthropic.com](https://console.anthropic.com) 看：
1. 账单余额是否真的到账
2. 当前 Key 是否被设了支出上限（**限额而非余额耗尽**）

### Q：换电脑了，怎么把登录信息迁过去

不需要迁。直接在新机器跑 `claude auth login` 重新走 OAuth / 输 API Key 就行。`~/.claude.json` 的 token 是机器本地的，迁过去多半也不能直接用。

---

## 看完这一章你应该知道

✅ 订阅用户用 OAuth、按量付费用 Anthropic Console API Key
✅ OAuth 浏览器没弹 → 手动复制 URL / 验证码救场
✅ API Key 拿到立刻塞进环境变量、**只显示一次**
✅ 多账号用项目级 settings.json 或 shell alias 隔离
✅ CI/CD 不订阅就用 API Key、订阅就 `claude setup-token`

---

**下一步**：[5. 5 分钟快速上手 →](/claude-code/guide/quickstart)
