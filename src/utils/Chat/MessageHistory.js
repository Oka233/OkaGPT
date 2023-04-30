import dateUtils from '@/utils/dateUtils'
import { users, roles } from '@/utils/Chat/users'

export class Message {
  constructor(options) {
    this.content = options.content
    this.date = options.date || dateUtils.getDate()
    this.timestamp = options.timestamp || dateUtils.getTimestamp()
    this.senderId = options.senderId
  }
  createSubMessages(contentArr) {
    this.subMessages = contentArr.map(content => {
      return new Message({
        content,
        senderId: this.senderId
      })
    })
  }
  getSubMessages() {
    return this.subMessages
  }
  toVAC = function() {
    if (this.subMessages) {
      return this.subMessages.map(subMessage => {
        return {
          content: subMessage.content,
          senderId: subMessage.senderId,
          username: users[subMessage.senderId],
          date: subMessage.date,
          timestamp: subMessage.timestamp
        }
      })
    } else {
      return [{
        content: this.content,
        senderId: this.senderId,
        username: users[this.senderId],
        date: this.date,
        timestamp: this.timestamp
      }]
    }
  }
  toOpenAI = function() {
    if (this.subMessages) {
      return this.subMessages.map(subMessage => {
        return {
          content: subMessage.content,
          role: roles[subMessage.senderId]
        }
      })
    } else {
      return [{
        content: this.content,
        role: roles[this.senderId]
      }]
    }
  }
}

export class MessageHistory {
  constructor(messages) {
    this.messages = messages.map(m => new Message(m))
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
        targetMessage.createSubMessages(contentArr)
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
}
