# 23. 高级配置

> 进阶配置选项，适合有特殊需求的用户。

## 多配置文件切换

针对不同项目使用不同配置，可以用环境变量指定配置文件路径：

```bash
# 使用指定配置文件启动
CODEX_CONFIG=~/.codex/work-config.toml codex

# 或者创建 shell alias
alias codex-work='CODEX_CONFIG=~/.codex/work-config.toml codex'
alias codex-personal='CODEX_CONFIG=~/.codex/personal-config.toml codex'
```

---

## 代理配置

如果你的网络需要通过代理访问 API：

```bash
# HTTP 代理
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"

# 然后启动 Codex
codex
```

或写入 shell 配置文件（`~/.zshrc` 或 `~/.bashrc`）：

```bash
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
```

::: tip 国内用户
如果使用国内模型（DeepSeek、通义千问等），不需要代理，直连即可。
:::

---

## 调整温度和 Token 上限

```toml
# ~/.codex/config.toml

[model]
provider = "deepseek"
name = "deepseek-chat"
temperature = 0.3         # 0-1，越低越保守，代码任务建议 0.1-0.3
max_tokens = 8192         # 单次响应最大 token 数
```

---

## 禁用 git 自动追踪

默认情况下 Codex 会在 git 仓库中追踪改动。如果不需要，可以关闭：

```toml
[agent]
disable_git_tracking = true
```

::: warning 不推荐关闭
关闭 git 追踪后无法使用回滚功能，建议保持默认开启。
:::

---

## 日志调试

启用详细日志以排查问题：

```bash
# 开启调试日志
CODEX_LOG=debug codex

# 保存日志到文件
CODEX_LOG=debug codex 2>&1 | tee codex-debug.log
```
