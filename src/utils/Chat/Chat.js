import { v4 as uuidv4 } from 'uuid'
import { MessageHistory } from '@/utils/Chat/MessageHistory'
import { users, roles } from '@/utils/Chat/users'
import { OpenAI } from '@/utils/Models/OpenAI'

class Chat {
  constructor(options) {
    console.log('chat options', options)
    options = options || {}
    this.chatId = options.chatId || uuidv4()
    // this.userName = `GPT No.${Object.keys(users).length}`
    this.userName = options.userName || 'GPT'
    users[this.chatId] = this.userName
    roles[this.chatId] = 'assistant'
    this.messageHistory = new MessageHistory(options.messageHistory)
    this.AI = new OpenAI(options)
    this.finishStatus = []
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
  streamNextMessage(message, callback1) {
    let messageSent
    if (message) {
      this.messageHistory.push(message)
      messageSent = this.messageHistory.recent()
    }
    // 需要在push用户输入和push空消息之间生成给gpt的对话列表
    const messageHistory = this.messageHistory.toOpenAI()
    let emptyMessagePushed = false
    const streamAnswer = (ans) => {
      // 在第一次收到回复时，push一条空消息
      if (!emptyMessagePushed) {
        this.messageHistory.push({
          content: '',
          senderId: this.chatId
        })
        emptyMessagePushed = true
      }
      console.log(ans[0])
      const answerNum = this.messageHistory.streamMessage(ans)
      callback1(this.messageHistory.toVAC().slice(-answerNum), messageSent)
    }
    const streamUsage = (usage, finishReasons) => {
      this.messageHistory.streamUsage(usage)
      // console.log(finishReasons)
      this.finishStatus = finishReasons
    }
    this.AI.streamChat(
      messageHistory,
      streamAnswer,
      streamUsage
    )
    return messageSent
  }
  toSave() {
    return {
      chatId: this.chatId,
      userName: this.userName,
      messageHistory: this.messageHistory.toSave()
    }
  }
}

function getChat(options) {
  return new Chat(options)
}

export default {
  getChat
}
