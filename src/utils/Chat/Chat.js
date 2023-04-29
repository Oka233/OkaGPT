import { v4 as uuidv4 } from 'uuid'
import { MessageHistory } from '@/utils/Chat/MessageHistory'
import { users } from '@/utils/Chat/users'

class Chat {
  constructor(options) {
    this.chatId = uuidv4()
    this.userName = `GPT No.${Object.keys(users).length}`
    users[this.chatId] = this.userName
    this.messageHistory = new MessageHistory([
      {
        senderId: this.chatId,
        content: 'Yooooooo'
      }
    ])
  }
  initMessage() {
    return new Promise((resolve, reject) => {
      resolve(this.messageHistory.toVAC())
    })
  }
  nextMessage(message) {
    this.messageHistory.push(message)
    const messageSent = this.messageHistory.recent()
    return [
      new Promise((resolve, reject) => {
        const newMessages = [{
          senderId: this.chatId,
          content: uuidv4()
        }]
        setTimeout(() => {
          this.messageHistory.push(newMessages)
          resolve(this.messageHistory.recent(newMessages.length))
        }, 2000)
      }),
      messageSent
    ]
  }
}

function getChat(options) {
  return new Chat(options)
}

export default {
  getChat
}
