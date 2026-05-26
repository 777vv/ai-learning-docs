# 21. GitHub Actions 集成

::: info 本章你将学到
- 一键配置 GitHub App
- 在 PR 中 @claude 触发代码审查
- 自动修复 PR 失败
- 在 CI 中用 claude -p 做自动化任务
:::

## 一键配置

在 Claude Code 会话中运行：

```
/install-github-app
```

按引导完成授权，Claude 会自动：
1. 在你的仓库安装 GitHub App
2. 创建必要的 GitHub Actions workflow 文件
3. 配置 secrets

## 在 PR 中使用

配置完成后，在任意 PR 评论里 @claude 即可触发：

```
@claude 审查这个 PR，重点关注安全问题

@claude 修复 CI 失败：[粘贴错误日志]

@claude 这个 PR 做了什么？写一个简明摘要

@claude 优化这段代码的性能
```

Claude 会回复审查意见，或直接推送修复 commit。

## 自动修复 PR 失败

```
/autofix-pr
```

开启后，Claude 会自动监视你的 PR：当 CI 失败时，它会分析错误原因，推送修复 commit，并在 PR 里评论说明原因。

## 手动编写 Workflow

也可以手动创建 workflow 文件，更灵活地控制：

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Review PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git diff origin/main...HEAD > pr_diff.txt
          cat pr_diff.txt | claude -p \
            "审查这个 PR 的代码变更。重点关注：
            1. 潜在的 bug
            2. 安全漏洞
            3. 性能问题
            4. 代码风格和可读性
            
            输出 Markdown 格式，分条列出问题，每条包含：问题描述、所在文件和行号、修复建议。" \
            --output-format text > review.md
          
          gh pr comment ${{ github.event.number }} --body "$(cat review.md)"
```

## 自动化代码任务

```yaml
# .github/workflows/auto-docs.yml
name: Auto Update Docs

on:
  push:
    branches: [main]
    paths:
      - 'src/api/**'

jobs:
  update-docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Update API Docs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p \
            "根据 src/api/ 目录下的代码变更，更新 docs/api.md 的 API 文档。
            保持现有文档结构，只更新有变化的部分。" \
            --allowedTools "Read,Write,Glob" \
            --dangerously-skip-permissions

      - name: Commit docs update
        run: |
          git config user.name "Claude Code Bot"
          git config user.email "bot@example.com"
          git add docs/api.md
          git diff --staged --quiet || git commit -m "docs: auto-update API docs"
          git push
```

## 在 CI 中的最佳实践

```bash
# 非交互模式，设置 Token 和超时
export ANTHROPIC_API_KEY="${{ secrets.ANTHROPIC_API_KEY }}"

# 限制最大回合数，防止无限循环
claude -p "任务" --max-turns 10

# 限制最大花费
claude -p "任务" --max-budget-usd 0.5

# 只允许特定工具（安全）
claude -p "任务" --tools "Read,Grep,Glob"

# JSON 输出方便脚本解析
claude -p "任务" --output-format json | jq '.result'
```

::: warning CI 安全注意事项
- 把 `ANTHROPIC_API_KEY` 存在 GitHub Secrets，不要硬编码
- 使用 `--tools` 限制 Claude 能用的工具，防止越权操作
- 对于会修改代码的 workflow，先在测试仓库验证
- 设置 `--max-budget-usd` 防止意外产生大额费用
:::

---

下一步：[22. Agents SDK 开发指南 →](/claude-code/integration/agents-sdk)
