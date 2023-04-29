import dateUtils from '@/utils/dateUtils'
import { users, roles } from '@/utils/Chat/users'

export class Message {
  constructor(options) {
    this.content = options.content
    this.date = options.date || dateUtils.getDate()
    this.timestamp = options.timestamp || dateUtils.getTimestamp()
    this.senderId = options.senderId
  }
  toVAC = function() {
    return {
      content: this.content,
      senderId: this.senderId,
      username: users[this.senderId],
      date: this.date,
      timestamp: this.timestamp
    }
  }
  toOpenAI = function() {
    return {
      content: this.content,
      role: roles[this.senderId]
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
  recent(n = 1) {
    return this.toVAC().slice(-n)
  }
  toVAC = function() {
    return this.messages.map((message, index) => {
      const res = message.toVAC()
      res._id = index
      return res
    })
  }
  toOpenAI = function() {
    const mh = this.messages.map((message, index) => {
      const res = message.toOpenAI()
      return res
    })
    return mh
  }
}
