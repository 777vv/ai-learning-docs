# 20. 代理与网络配置

::: info 本章你将学到
- 如何为 Claude Code 配置代理（Win/Mac/Linux 三平台）
- 常见代理软件（Clash / V2Ray 等）的端口怎么找
- **怎么验证代理真的生效了**（最关键的一步）
- 企业 API 中转服务怎么接
- 分流白名单 / 黑名单参考
- 网络诊断完整流程
:::

## 20.1 决定你该怎么配代理

::: tip 三种典型场景，按你的对号入座
| 你的情况 | 配置方式 |
|---|---|
| 个人电脑装了 Clash / V2Ray | [20.2 系统代理软件](#_20-2-系统代理软件方式) |
| 公司给了一个 API 中转地址 | [20.4 API 端点中转](#_20-4-企业-api-中转服务) |
| 完全不翻墙、用国内服务商 | **不用配代理**，看 [国内模型接入](/claude-code/china/models) |
| 公司网络强制走指定代理 | [20.2](#_20-2-系统代理软件方式)，端口问 IT |
:::

## 20.2 系统代理软件方式

Claude Code 遵循标准 HTTP 代理环境变量。

### 第 1 步：找到代理软件的端口

打开你的代理软件，按下表找端口号（**别背默认值**，每个人可能改过）：

| 软件 | 看哪里 | 典型默认值 |
|------|---|---|
| **Clash / Clash Verge** | 设置 → 端口（Port）/ 混合端口（Mixed Port） | HTTP 7890 / SOCKS5 7891 |
| **V2Ray / V2RayN** | 配置 → 出站代理 inbounds | HTTP 10809 / SOCKS5 10808 |
| **Xray** | 同 V2Ray | HTTP 10809 / SOCKS5 10808 |
| **Shadowsocks** | 高级设置 → 监听端口 | HTTP 1087 / SOCKS5 1086 |
| **Trojan** | 客户端设置 | HTTP 1087 |
| **Surge** | 通用 → HTTP 代理端口 | HTTP 6152 / SOCKS5 6153 |

::: tip 不知道用哪个端口
**首选 HTTP 端口**——HTTP 代理兼容性最好。SOCKS5 在某些 Node.js 工具里要装额外的库（`node-socks-proxy-agent`）才能跑，能避免就避免。
:::

### 第 2 步：设环境变量

::: code-group

```bash [macOS / Linux 临时（当前终端）]
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

```bash [macOS / Linux 永久]
# 加到 ~/.zshrc（zsh 用户）或 ~/.bashrc（bash 用户）
echo 'export HTTP_PROXY=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export HTTPS_PROXY=http://127.0.0.1:7890' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows PowerShell 临时]
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

```powershell [Windows PowerShell 永久]
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")
# 关掉 PowerShell 重开生效
```

:::

也可以写到 `~/.claude/settings.json`：

```json
{
  "env": {
    "HTTP_PROXY": "http://127.0.0.1:7890",
    "HTTPS_PROXY": "http://127.0.0.1:7890"
  }
}
```

### 第 3 步：⭐ 验证代理真的生效了

这是最关键的一步。**直接 `claude` 试很难判断哪里错**——分开测能让排错精准 10 倍。

```bash
# 测试 1：不走代理能直连吗
curl -I --max-time 5 https://api.anthropic.com
```

| 结果 | 含义 |
|---|---|
| ✅ 返回 `HTTP/2 200` 或 `HTTP/2 404` | 网络直连通，不需要代理 |
| ❌ `Connection timed out` / `Could not resolve host` | 直连不通，**继续测试 2** |
| ❌ `SSL certificate problem` | 中间网络拦截了，需配代理 |

```bash
# 测试 2：走代理能通吗
curl -I --max-time 5 --proxy http://127.0.0.1:7890 https://api.anthropic.com
```

| 结果 | 含义 |
|---|---|
| ✅ `HTTP/2 200` 或 `HTTP/2 404` | 代理工作正常 |
| ❌ `Failed to connect to 127.0.0.1 port 7890` | 代理软件没开 / 端口错 |
| ❌ `Proxy CONNECT aborted` | 代理软件没开「系统代理」开关 |

```bash
# 测试 3：环境变量真的设上了
echo $HTTPS_PROXY        # macOS / Linux
$env:HTTPS_PROXY         # Windows PowerShell
```

应该输出你设的值（`http://127.0.0.1:7890`）。**输出为空** = 当前 shell 没读到，重启终端或重新 source 配置。

```bash
# 测试 4：Claude Code 自己的网络体检
claude doctor
```

`claude doctor` 会列出当前所有环境变量、API 端点配置、连接状态。**排错时第一个跑这个**。

## 20.3 SOCKS5 代理（高级，多数人不用）

如果你的代理软件只暴露 SOCKS5 端口：

```bash
export HTTPS_PROXY=socks5://127.0.0.1:7891
```

::: warning Claude Code + SOCKS5 可能要装额外依赖
SOCKS5 在 Node.js / npm 生态里需要 `socks-proxy-agent` 之类的库。如果配了 SOCKS5 还不通，**优先换回 HTTP 端口**。
:::

## 20.4 企业 API 中转服务

公司给你一个**自己的中转域名**（不是翻墙、是公司维护的 API 镜像）：

```json
{
  "apiBase": "https://your-proxy.example.com/anthropic",
  "apiKey": "${ANTHROPIC_API_KEY}"
}
```

或环境变量：

```bash
export ANTHROPIC_API_BASE="https://your-proxy.example.com/anthropic"
```

::: tip 中转服务 vs 系统代理 的区别
- **系统代理**（HTTP_PROXY） = 走代理服务器**转发**到真正的 `api.anthropic.com`
- **API 中转**（ANTHROPIC_API_BASE） = 直接发到一个**仿 API 接口**的服务器（公司或第三方维护，跟 Anthropic 没关系）

两个不是非此即彼，可以同时用（中转 + 代理）。
:::

## 20.5 分流配置参考

如果你的代理软件支持**分流**（只对特定域名走代理），按这份白名单配置体验最佳：

```
# 走代理（访问 Anthropic 官方需要）
api.anthropic.com
console.anthropic.com
claude.ai

# 直连（国内服务，走代理反而慢）
api.siliconflow.cn
open.bigmodel.cn
dashscope.aliyuncs.com
api.deepseek.com
openrouter.ai

# 直连（避免拖慢本地工具）
localhost
127.0.0.1
*.local
```

`NO_PROXY` 也可以走环境变量：

```bash
export NO_PROXY="localhost,127.0.0.1,*.cn,api.siliconflow.cn,api.deepseek.com"
```

## 20.6 网络诊断完整流程

按这个顺序跑，定位精准到每一层：

```bash
# 1. DNS 解析正常吗
nslookup api.anthropic.com
# 或
ping api.anthropic.com

# 2. TCP 端口连得通吗
curl -v --max-time 5 https://api.anthropic.com 2>&1 | head -10

# 3. Claude Code 自查
claude doctor

# 4. 看完整 API 请求日志
claude --debug "api"

# 5. 把日志写文件慢慢分析
claude --debug-file /tmp/claude-net-debug.log --debug "api"
```

### `claude doctor` 输出怎么看

正常时会看到类似：
```
✓ Binary: /usr/local/bin/claude
✓ Version: 2.x.x
✓ API: https://api.anthropic.com (reachable, 234ms)
✓ Auth: logged in as you@example.com
```

异常时关键字：
- `unreachable` = 网络不通
- `auth: not logged in` = 没登录，[去 4.2](/claude-code/guide/auth)
- `proxy not set` 而你期望走代理 = 环境变量没生效

## 20.7 常见网络问题

### 超时错误

```bash
# 增大 HTTP 超时（默认 60 秒，单位毫秒）
export ANTHROPIC_HTTP_TIMEOUT=120000
```

如果整体很慢，**先解决代理 / 网络**问题，加超时只是治标。

### SSL 证书错误

::: danger ⚠️ 跳过 SSL 验证：什么时候才能用、什么时候绝对不能用

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

**这条命令的意思**：让 Claude Code 信任所有证书——包括伪造的、过期的、自签名的。**等于把"https 是不是真的 https"的检查全关掉**。

**什么时候才能用**：
- ✅ 你**完全清楚**的企业内部环境，中间有公司的 MITM 代理（用公司自签 CA）
- ✅ 调试时临时确认问题原因
- ❌ **绝对不要**为了"让它跑起来"长期开着——这是开门请贼

**长期方案**：把公司的 CA 证书加进系统受信任根证书，而不是关掉所有验证。问 IT 怎么导入。
:::

### 代理不生效

按这个顺序排查：
1. **代理软件本身在跑吗** → 任务栏图标 / 系统托盘看一眼
2. **代理软件开了"系统代理"开关吗** → Clash / V2Ray 主界面通常有个总开关
3. **端口对吗** → 用代理软件主界面的实时显示，**不要靠默认值**
4. **环境变量在当前 shell 真的有吗** → `echo $HTTPS_PROXY`（Windows: `$env:HTTPS_PROXY`）
5. **Windows 用户：重开过 PowerShell 吗** → `[Environment]::SetEnvironmentVariable` 设的，必须**关掉再开**才生效

### 部分时候通、部分时候断

通常是代理服务器抖动 / 国外网络抽风。两个缓解办法：

```bash
# 1. 改用更稳的中转（国内服务商或公司中转）
# 见 /claude-code/china/models

# 2. 加大重试和超时
export ANTHROPIC_HTTP_TIMEOUT=180000
```

---

## 看完这一章你应该知道

✅ 代理软件先看自家界面找端口，**别背默认值**
✅ 配完一定跑 4 步验证（直连测试 → 代理测试 → 环境变量 → `claude doctor`）
✅ HTTP 代理优先，SOCKS5 兼容性差
✅ 企业 API 中转用 `ANTHROPIC_API_BASE`，跟系统代理是两个概念
✅ **`NODE_TLS_REJECT_UNAUTHORIZED=0` 是大杀器，不要长期开**
✅ 出问题第一步：`claude doctor`

---

**下一步**：[21. GitHub Actions 集成 →](/claude-code/integration/github-actions)
