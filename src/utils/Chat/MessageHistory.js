import { Message } from '@/utils/Chat/Message'

export class MessageHistory {
  constructor(options) {
    // console.log('options', options)
    options = options || { messages: [] }
    this.messages = options.messages.map(m => new Message(m))
    this.usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  }
  streamUsage(usage) {
    this.usage.prompt_tokens += usage.prompt_tokens
    this.usage.completion_tokens += usage.completion_tokens
    this.usage.total_tokens += usage.total_tokens
  }
  push(message) {
    if (message instanceof Array) {
      message.forEach(m => this.push(m))
      return
    }
    this.messages.push(new Message(message))
  }
  streamMessage(contentArr) {
    const targetMessage = this.messages[this.messages.length - 1]
    if (contentArr.length > 1) {
      if (targetMessage.getSubMessages()) {
        targetMessage.getSubMessages().forEach((subMessage, index) => {
          subMessage.content += contentArr[index]
        })
      } else {
        targetMessage.createSubMessages(contentArr.map(content => { return { content: content } }))
      }
      // if ('temp' in this.messages[this.messages.length - 1]) {
      //   contentArr.forEach((content, index) => {
      //     targetMessage.temp[index] += content
      //   })
      // } else {
      //   targetMessage.temp = contentArr
      // }
      // targetMessage.content = targetMessage.temp.join('\n\n__________________\n\n')
    } else {
      targetMessage.content += contentArr[0]
    }
    return contentArr.length
  }
  recent(n = 1) {
    return this.toVAC().slice(-n)
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
