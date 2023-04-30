import { v4 as uuidv4 } from 'uuid'
import { MessageHistory } from '@/utils/Chat/MessageHistory'
import { users, roles } from '@/utils/Chat/users'
import { OpenAI } from '@/utils/Models/OpenAI'

class Chat {
  constructor(options) {
    this.chatId = uuidv4()
    // this.userName = `GPT No.${Object.keys(users).length}`
    this.userName = 'GPT'
    users[this.chatId] = this.userName
    roles[this.chatId] = 'assistant'
    this.messageHistory = new MessageHistory([])
    this.AI = new OpenAI(options)
    // this.AI.listEngines()
  }
  getMessageHistory() {
    return this.messageHistory.toVAC()
  }
  nextMessage(message) {
    /**
     * 如果message为空且存在历史消息，则返回历史消息
     * 如果message为空但不存在历史消息，则发送一次空请求（获取role system的回复）
     * 如果message不为空，则发送一次回答请求
     */
    const messageHistory = this.messageHistory.toVAC()
    if (!message && messageHistory.length) {
      return [
        new Promise((resolve, reject) => {
          resolve(this.messageHistory.toVAC())
        }),
        null
      ]
    }
    let messageSent
    if (message) {
      this.messageHistory.push(message)
      messageSent = this.messageHistory.recent()
    }
    return [
      new Promise((resolve, reject) => {
        this.AI.chat(this.messageHistory)
          .then(res => {
            console.log('result', res)
            const content = res.data.choices[0].message.content
            this.messageHistory.push({
              content,
              senderId: this.chatId
            })
            resolve(this.messageHistory.toVAC().slice(-1))
          })
          .catch(e => {
            reject(e)
          })
      }),
      messageSent
    ]
  }
  streamNextMessage(message, callback) {
    let messageSent
    if (message) {
      this.messageHistory.push(message)
      messageSent = this.messageHistory.recent()
    }
    // 需要在push用户输入和push空消息之间生成给gpt的对话列表
    const messageHistory = this.messageHistory.toOpenAI()
    this.messageHistory.push({
      content: '',
      senderId: this.chatId
    })
    const streamAnswer = (ans) => {
      const answerNum = this.messageHistory.streamMessage(ans)
      callback(this.messageHistory.toVAC().slice(-answerNum), messageSent)
    }
    this.AI.streamChat(
      messageHistory,
      streamAnswer
    )
    return messageSent
  }
}

function getChat(options) {
  return new Chat(options)
}

export default {
  getChat
}
