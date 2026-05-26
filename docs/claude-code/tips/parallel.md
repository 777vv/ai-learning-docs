# 29. 并行与自动化

::: info 本章你将学到
- 非交互模式（脚本/CI）用法
- Git Worktree 并行开发
- /batch 大规模并行改动
- 定时任务配置
:::

## 23.1 非交互模式（`-p`）

`-p` 模式执行一次查询后立即退出，适合脚本和 CI：

```bash
# 单次查询
claude -p "这个项目有什么已知问题？"

# 分析变更
git diff origin/main | claude -p "这些改动有安全风险吗？" --output-format text

# JSON 输出（方便脚本解析）
claude -p "列出所有 API 端点，输出 JSON" --output-format json | jq '.[]'

# 流式 JSON（实时处理大输出）
claude -p "分析这个大文件" --output-format stream-json

# 限制花费
claude -p "重构这个文件" --max-budget-usd 0.1

# 只允许特定工具（更安全）
claude -p "审查代码" --tools "Read,Grep,Glob"
```

## 23.2 Git Worktree 并行开发

Git Worktree 允许你在同一个仓库的多个分支上**同时**工作，每个分支在独立目录：

```bash
# 自动创建 worktree 并启动 Claude
claude -w feature-auth

# 用 tmux 在新 pane 里打开
claude -w login-bug --tmux

# 手动创建 worktree
git worktree add -b feature-x ../project-feature-x main
cd ../project-feature-x
claude
```

**典型用法**：
- 终端 1：`claude -w feature-auth`（实现新功能）
- 终端 2：`claude -w bugfix-login`（同时修 bug）
- 两个会话互不干扰，分别在不同分支上工作

## 23.3 /batch 大规模并行

`/batch` 把一个大任务自动分解成多个子任务并行执行，每个生成独立 PR：

```
# 大规模代码迁移
/batch 把 src/ 下所有 React 类组件迁移到函数组件

# 批量测试补充
/batch 给所有缺少测试的 service 文件补充单元测试

# 批量代码清理
/batch 把所有 console.log 改成 logger.debug，并引入合适的 logger

# 批量文档更新
/batch 给 src/api/ 下所有没有 JSDoc 注释的函数加注释
```

Claude 会：
1. 分析任务，自动拆分成 5-30 个子任务
2. 并行处理（每个文件独立处理）
3. 每个子任务生成一个独立的 PR

## 23.4 Fan-Out 脚本

手动并行处理多个文件：

```bash
#!/bin/bash
# 并行迁移多个文件
files=$(find src/components -name "*.tsx" -type f)

for file in $files; do
  claude -p "把 $file 从 React 16 的 componentDidMount 迁移到 useEffect 钩子。
    只改动这一个文件，输出 OK 或 FAIL。" \
    --allowedTools "Read,Edit" \
    --max-budget-usd 0.05 &
done

wait
echo "所有文件处理完成"
```

## 23.5 Writer + Reviewer 协作模式

开两个终端，一个写代码，一个审查：

```bash
# 终端 1：写代码
claude "实现 API 限流中间件"

# 终端 2：审查（在代码写完后）
claude -p "审查 src/middleware/rateLimiter.ts，
找边界情况、竞态条件，和已有中间件的一致性。
给出具体行号和修改建议。" \
--tools "Read,Grep,Glob"
```

## 23.6 定时任务

### 会话内循环（`/loop`）

```
/loop 5m 检查 CI 是否通过，如果失败告诉我原因
/loop 10m git pull && npm test 2>&1 | tail -20
```

### 托管定时任务（`/schedule`）

关机也能运行，由 Anthropic 基础设施托管：

```
/schedule
```

按引导配置：
- 触发时间（cron 表达式）
- 要执行的任务描述
- 通知方式

### GitHub Actions 定时任务

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'   # 每周一早上 9 点

jobs:
  weekly-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          git log --oneline --since="1 week ago" > changes.txt
          cat changes.txt | claude -p \
            "总结这周的代码变更，生成周报，发给团队" \
            --output-format text
```

## 23.7 CI/CD 集成模板

```yaml
# .github/workflows/claude-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - run: npm install -g @anthropic-ai/claude-code

      - name: Run Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          claude -p "$(git diff origin/${{ github.base_ref }}...HEAD)" \
            "审查这些代码变更，输出 Markdown 格式的审查意见" \
            --max-turns 5 \
            --max-budget-usd 0.5 \
            --tools "Read,Grep" > review.md
          
          gh pr comment ${{ github.event.number }} --body "$(cat review.md)"
```
