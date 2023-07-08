import { roles, users } from '@/utils/Chat/users'

export class Message {
  constructor(options) {
    const textMessage = (m) => {
      this.content = m.content
      this.date = m.date || new Date().toDateString()
      this.timestamp = m.timestamp || new Date().toString().substring(16, 21)
      this.senderId = m.senderId
    }
    if (options.type) {
      switch (options.type) {
        case 'text': {
          textMessage(options.message)
          break
        }
        case 'sub': {
          this.createSubMessages(options.subMessages)
        }
      }
    } else {
      textMessage(options)
    }
  }
  createSubMessages(messages) {
    this.subMessages = messages.map(m => {
      m.senderId = this.senderId
      return new Message(m)
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
  toSave() {
    if (this.subMessages) {
      return {
        type: 'sub',
        subMessages: this.subMessages.map(subMessage => {
          return subMessage.toSave()
        })
      }
    } else {
      return {
        type: 'text',
        message: {
          content: this.content,
          senderId: this.senderId,
          date: this.date,
          timestamp: this.timestamp
        }
      }
    }
  }
}
