# 20. GitHub Action 集成

> **本文你将学会：** 在 GitHub CI/CD 中用 Codex 自动做代码审查、修复 lint、生成 changelog，含怎么验证 workflow 跑成功 / 失败、安全要点。

::: info GitHub Actions 是什么？
**GitHub Actions** = GitHub 自带的 CI/CD 工具。你在仓库里放一个 `.github/workflows/xxx.yml` 文件，定义"什么时候触发 + 做什么"。GitHub 会在它的服务器上跑这些任务。

**典型触发**：
- 有人开了 PR → 自动跑代码审查
- 推到 main 分支 → 自动跑测试
- 打 Tag 发版 → 自动生成 changelog

把 Codex 接进 GitHub Actions = 让 AI **24 小时无人值守地审你的代码 / 改 lint**。
:::

## 使用场景

| 场景 | 触发时机 | 效果 |
|------|----------|------|
| 自动代码审查 | PR 创建 / 更新时 | Codex 自动 Review 并留评论 |
| 自动修复 lint 错误 | Push 到分支后 | Codex 自动改 + commit |
| 自动生成变更日志 | 打 Tag 时 | Codex 写 CHANGELOG |
| 自动回答 issue 问题 | 有 issue 评论时 | Codex 检索代码回答 |

## 场景 1：自动代码审查（最常用）

在项目 `.github/workflows/` 目录下创建工作流文件：

::: tip 怎么创建 workflow 文件？
两种方式：

**A. 在本地建**：
```bash
mkdir -p .github/workflows
nano .github/workflows/codex-review.yml
# 粘贴下面的 YAML 内容
git add .github/workflows/codex-review.yml
git commit -m "ci: add Codex review workflow"
git push
```

**B. 在 GitHub 网页建**：仓库主页 → Actions 标签 → "New workflow" → "set up a workflow yourself"
:::

```yaml
# .github/workflows/codex-review.yml
name: Codex Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write   # 给 Codex 留评论的权限

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0   # 完整 git 历史，让 Codex 能看 diff

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install Codex
        run: npm install -g @openai/codex

      - name: Run Codex Review
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          codex --approval-mode read-only \
            "审查这个 PR 的所有改动（git diff main...HEAD），
             检查 bug、安全问题和代码质量，
             用 Markdown 格式输出结果" > review.md

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🤖 Codex 代码审查\n\n${review}`
            });
```

::: tip YAML 缩进有坑
YAML 用**空格缩进**敏感（**不能用 Tab**）。复制粘贴时检查没空格被吃。
:::

## 配置 GitHub Secrets

::: warning 不能把 API Key 写进 .yml 文件！
那等于在公开仓库里明文晒密钥，任何人能拿来刷你的钱。**必须用 GitHub Secrets**。
:::

1. 打开 GitHub 仓库 → **Settings** 标签 → 左侧 **Secrets and variables** → **Actions**
2. 点 **"New repository secret"**
3. 填写：
   - **Name**：`OPENAI_API_KEY`
   - **Value**：粘贴你的 API Key
4. 保存

workflow 里用 <span v-pre>`${{ secrets.OPENAI_API_KEY }}`</span> 引用——GitHub 在运行时注入到环境变量，**不会暴露在日志里**。

::: tip 用国内模型（DeepSeek 等）
1. 在 Secrets 里加 `DEEPSEEK_API_KEY`
2. workflow 改成：
   ```yaml
   env:
     OPENAI_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
     OPENAI_BASE_URL: "https://api.deepseek.com/v1"
   ```
3. 用 `codex --model deepseek-chat` 启动
:::

## 怎么验证 workflow 跑成功？

### 触发后看运行情况

1. 触发条件满足（如开个 PR）后，**仓库主页 → Actions 标签**
2. 看左侧最新一次 workflow 运行
3. 状态符号：
   - 🟢 绿勾 = 全部成功
   - 🔴 红叉 = 某一步失败
   - 🟡 黄圆 = 正在跑

### 看每一步的详细日志

1. 点进失败的 workflow run
2. 点失败的 job（左侧）
3. 展开报错的 step——里面有完整 stdout / stderr

### 常见首次跑失败原因

| 错误现象 | 原因 | 修法 |
|---|---|---|
| `Error: Resource not accessible by integration` | workflow 缺权限 | 在 `permissions:` 里加 `pull-requests: write` |
| `OPENAI_API_KEY: secret not found` | Secret 没建 / 名字拼错 | 去 Settings → Secrets 检查 |
| `command not found: codex` | `npm install -g` 失败 | 加 `node-version: '22'`，确保 Node.js 装好 |
| `git diff main...HEAD` 空 | `fetch-depth: 0` 没设 | 加 `with: fetch-depth: 0` |

## 场景 2：自动修复 lint 错误

```yaml
# .github/workflows/codex-fix.yml
name: Auto Fix Lint

on:
  push:
    branches: [main, develop]

jobs:
  auto-fix:
    runs-on: ubuntu-latest
    permissions:
      contents: write   # 需要推送权限

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - run: npm ci
      - run: npm install -g @openai/codex

      - name: Auto Fix
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          codex --approval-mode auto \
            "运行 npm run lint，修复所有 lint 错误，
             然后运行 npm test 确保测试通过"

      - name: Commit fixes
        run: |
          git config --local user.email "codex-bot@github.com"
          git config --local user.name "Codex Bot"
          git add -A
          git diff --staged --quiet || git commit -m "fix: auto fix lint errors by Codex"
          git push
```

::: warning 直接推 main 风险
上面这个 workflow **直接推到 main 分支**。更稳妥的做法是**开 PR**，让人审完再合：

```yaml
- name: Create PR with fixes
  uses: peter-evans/create-pull-request@v6
  with:
    branch: codex/auto-fix-${{ github.run_id }}
    title: "🤖 Codex auto-fix lint"
    body: "Codex 自动修复了 lint 错误，请审查"
```
:::

## 场景 3：自动生成 CHANGELOG

```yaml
on:
  push:
    tags: ['v*']   # 打了 vX.Y.Z 标签时触发

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - run: npm install -g @openai/codex

      - name: Generate Changelog
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          codex --approval-mode auto \
            "用 git log 看从上一个 tag 到现在的所有 commit，
             按 feat / fix / docs / refactor 分类，
             写一份用户视角的 CHANGELOG.md（中文），
             重要变化用 ⭐ 标注"
```

## 安全注意事项

::: warning 在 CI 中用 Codex 的 4 条铁律
1. **权限最小化**：默认用 `--approval-mode read-only`，只有明确要写文件时才用 `auto`
2. **审查 AI 改动**：自动修复**建议创建 PR 而非直接推 main**——让人看一眼再合
3. **费用控制**：在 [platform.openai.com](https://platform.openai.com/account/limits) 设月度支出上限，避免 CI 循环调用爆账单
4. **Secret 不要泄露**：API Key 永远只在 <span v-pre>`${{ secrets.X }}`</span> 里引用，**不要 echo 它到日志**
:::

## 让 workflow 只在特定文件改动时触发

避免每次推送都跑（省时间 + 省钱）：

```yaml
on:
  pull_request:
    paths:
      - 'src/**'           # 只在 src 目录改动时
      - '!docs/**'         # 但忽略 docs
      - '!**.md'           # 忽略所有 markdown
```

## 监控 Codex 在 CI 的费用

### 估算单次 PR 的成本

| 模型 | 一次 PR 审查（约 500 行 diff） |
|---|---|
| gpt-5.2-codex | ¥1-3 |
| gpt-5.1-codex-mini | ¥0.2-0.5 |
| DeepSeek V3 | ¥0.05-0.1 |

一个活跃团队一个月 100 个 PR：用 Mini 约 ¥20-50，用 DeepSeek 约 ¥5-10。

### 设支出上限

`platform.openai.com/account/limits`：设 **Monthly budget**——超过自动断 API 调用，防止意外刷爆。

## 排错速查

### Q：workflow 跑了但没看到 PR 评论

检查 `permissions:` 里有没有 `pull-requests: write`。

### Q：用国内模型在 CI 里报"连接超时"

GitHub Actions 跑在海外服务器，访问国内 API**反而可能慢**。两个办法：
1. 用 OpenAI 官方（CI 环境海外访问最稳）
2. 用 self-hosted runner（在你自己的国内机器上跑）

### Q：workflow 把 Secret 打印到日志了

GitHub 会自动把 Secret 替换为 `***`。但如果你的代码主动把它输出到非常见位置（如写到文件、base64 编码后输出），可能漏掉。**永远不要主动 echo Secret**。

### Q：怎么本地测试 workflow（不用真推 GitHub）

用 [act](https://github.com/nektos/act) 本地跑 GitHub Actions：
```bash
brew install act       # macOS
act pull_request       # 本地模拟一次 PR 触发
```

## 下一步

- 🛠️ [Skills 系统](/codex/advanced/skills-system) — 把 CI 工作流提示词模板化
- 🔐 [Agent 权限模式](/codex/features/agent-modes)
- ⚙️ [配置文件详解](/codex/config/config-basic)
