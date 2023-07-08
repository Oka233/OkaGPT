import { Message } from '@/utils/Chat/Message'

export class MessageHistory {
  constructor(options) {
    options = options || { messages: [] }
    this.messages = options.messages.map(m => new Message(m))
    this.usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  }
  push(message) {
    // 非流式传输推入消息
    if (message instanceof Array) {
      message.forEach(m => this.push(m))
      return
    }
    this.messages.push(new Message(message))
  }
  streamMessage(contentArr) {
    // 流式传输通过修改最后一个消息展示
    const targetMessage = this.messages[this.messages.length - 1]
    if (contentArr.length > 1) {
      // n>1时，采用子消息存储多个消息
      if (targetMessage.getSubMessages()) {
        targetMessage.getSubMessages().forEach((subMessage, index) => {
          subMessage.content += contentArr[index]
        })
      } else {
        targetMessage.createSubMessages(contentArr.map(content => { return { content: content } }))
      }
    } else {
      targetMessage.content += contentArr[0]
    }
    return contentArr.length
  }
  streamUsage(usage) {
    this.usage.prompt_tokens += usage.prompt_tokens
    this.usage.completion_tokens += usage.completion_tokens
    this.usage.total_tokens += usage.total_tokens
  }
  toVAC = function() {
    const mh = []
    let cnt = 0
    this.messages.forEach((message, index) => {
      message.toVAC().forEach(m => {
        m._id = cnt++
        mh.push(m)
      })
    })
    return mh
  }
  toOpenAI = function() {
    const mh = []
    this.messages.forEach((message, index) => {
      message.toOpenAI().forEach(m => {
        mh.push(m)
      })
    })
    return mh
  }
  toSave() {
    return {
      messages: this.messages.map(m => m.toSave())
    }
  }
  len() {
    return this.messages.length
  }
}
