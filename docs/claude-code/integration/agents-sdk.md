# 22. Agents SDK 开发指南

::: info 本章你将学到
- 什么是 Agents SDK
- 如何用 Claude API 构建自定义 Agent
- Tool Use（工具调用）的实现方式
- 提示词缓存和成本优化
:::

## 什么是 Agents SDK

通过 Anthropic API，你可以把 Claude 嵌入到自己的应用程序中，构建定制化的 Agent。与 Claude Code 的「开箱即用」不同，SDK 方式让你完全控制：

- Agent 的行为和限制
- 可用的工具和权限
- 提示词和响应格式
- 成本和速率控制

## 安装 SDK

::: code-group

```bash [Node.js]
npm install @anthropic-ai/sdk
```

```bash [Python]
pip install anthropic
```

:::

## 基础 Agent 示例

::: code-group

```typescript [TypeScript]
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function runAgent(userMessage: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      { role: 'user', content: userMessage }
    ]
  })

  return response.content[0].type === 'text'
    ? response.content[0].text
    : ''
}

const result = await runAgent('解释一下什么是递归')
console.log(result)
```

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

def run_agent(user_message: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )
    return response.content[0].text

result = run_agent("解释一下什么是递归")
print(result)
```

:::

## Tool Use（工具调用）

Tool Use 是构建真正 Agent 的核心——让 Claude 能调用你定义的函数：

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const client = new Anthropic()

// 定义工具
const tools: Anthropic.Tool[] = [
  {
    name: 'read_file',
    description: '读取指定路径的文件内容',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: '文件路径'
        }
      },
      required: ['path']
    }
  },
  {
    name: 'run_command',
    description: '执行 shell 命令并返回输出',
    input_schema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: '要执行的命令'
        }
      },
      required: ['command']
    }
  }
]

// 实现工具
function executeTool(name: string, input: Record<string, string>): string {
  if (name === 'read_file') {
    try {
      return readFileSync(input.path, 'utf-8')
    } catch (e) {
      return `错误：无法读取文件 ${input.path}`
    }
  }
  if (name === 'run_command') {
    try {
      return execSync(input.command, { encoding: 'utf-8' })
    } catch (e: unknown) {
      return `命令失败：${e instanceof Error ? e.message : String(e)}`
    }
  }
  return '未知工具'
}

// Agent 循环
async function runCodeAgent(task: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: task }
  ]

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      tools,
      messages
    })

    // 把 Claude 的回复加入对话历史
    messages.push({ role: 'assistant', content: response.content })

    // 如果 Claude 结束了，输出最终结果
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text')
      return textBlock?.type === 'text' ? textBlock.text : ''
    }

    // 如果 Claude 要调用工具，执行工具并反馈结果
    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          const result = executeTool(
            block.name,
            block.input as Record<string, string>
          )
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: result
          })
        }
      }

      messages.push({ role: 'user', content: toolResults })
    }
  }
}

// 使用
const result = await runCodeAgent(
  '读取 src/index.ts，解释它的主要功能'
)
console.log(result)
```

## 提示词缓存（节省成本）

对于需要频繁发送的长系统提示，启用缓存可以节省高达 90% 的成本：

```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: [
    {
      type: 'text',
      text: `你是一个专业的代码审查助手。你的职责是：
      
      1. 发现代码中的 bug 和逻辑错误
      2. 识别安全漏洞（注入、XSS、认证问题等）
      3. 指出性能问题
      4. 提供具体的改进建议
      
      [... 更多很长的系统提示 ...]`,
      
      // 标记这部分为可缓存内容
      cache_control: { type: 'ephemeral' }
    }
  ],
  messages: [
    { role: 'user', content: `审查这段代码：\n\n${code}` }
  ]
})
```

## 流式输出

```typescript
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 2048,
  messages: [{ role: 'user', content: '写一首关于编程的诗' }]
})

// 实时输出
for await (const chunk of stream) {
  if (
    chunk.type === 'content_block_delta' &&
    chunk.delta.type === 'text_delta'
  ) {
    process.stdout.write(chunk.delta.text)
  }
}

// 获取完整响应
const finalMessage = await stream.getFinalMessage()
console.log('\n\n完整响应:', finalMessage.usage)
```

## 多轮对话

```typescript
const conversation: Anthropic.MessageParam[] = []

async function chat(userMessage: string): Promise<string> {
  conversation.push({ role: 'user', content: userMessage })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: '你是一个友好的编程助手，用中文回复。',
    messages: conversation
  })

  const assistantMessage = response.content[0].type === 'text'
    ? response.content[0].text
    : ''

  conversation.push({ role: 'assistant', content: assistantMessage })
  return assistantMessage
}

// 多轮对话示例
console.log(await chat('什么是闭包？'))
console.log(await chat('给我一个 JavaScript 的例子'))
console.log(await chat('有什么常见的应用场景？'))
```

## 常用模型速查

| 模型 ID | 特点 | 适用场景 |
|---------|------|---------|
| `claude-sonnet-4-6` | 平衡性能和成本 | 大多数任务（推荐）|
| `claude-opus-4-7` | 最强推理能力 | 复杂任务、代码生成 |
| `claude-haiku-4-5` | 速度最快、最便宜 | 简单分类、快速问答 |

完整 API 文档：[docs.anthropic.com](https://docs.anthropic.com)

---

下一步：[23. 实战案例总览 →](/claude-code/cases/)
