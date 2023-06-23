import { v4 as uuidv4 } from 'uuid'
import { MessageHistory } from '@/utils/Chat/MessageHistory'
import { users, roles } from '@/utils/Chat/users'
import store from '@/store'

export class Chat {
  constructor(options) {
    // console.log('chat options', options)
    options = options || {}
    this.chatId = options.chatId || uuidv4()
    this.title = options.title || '新的对话'
    // this.userName = `GPT No.${Object.keys(users).length}`
    this.userName = options.userName || 'GPT'
    users[this.chatId] = this.userName
    roles[this.chatId] = 'assistant'
    this.messageHistory = new MessageHistory(options.messageHistory)
    this.chatModel = store.getters.chatModel
    this.finishStatus = ['waiting']
  }
  getMessageHistory() {
    return this.messageHistory.toVAC()
  }
  getBlankMessage() {
    const mh = new MessageHistory()
    mh.push({
      senderId: this.chatId,
      content: '...'
    })
    return mh.toVAC()
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
        this.chatModel.chat(this.messageHistory)
          .then(res => {
            // console.log('result', res)
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
  streamNextMessage(message, callback1, onFinish) {
    if (this.messageHistory.len() === 0 && message) {
      this.setTitle(message)
      // return
    }
    this.finishStatus = ['waiting']
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
      // 保证同时接收多条回复时同时出现
      if (!emptyMessagePushed) {
        this.messageHistory.push({
          content: '',
          senderId: this.chatId
        })
        emptyMessagePushed = true
      }
      // console.log(ans[0])
      const answerNum = this.messageHistory.streamMessage(ans)
      callback1(this.messageHistory.toVAC().slice(-answerNum), messageSent)
    }
    const streamUsage = (usage, finishReasons) => {
      this.messageHistory.streamUsage(usage)
      // console.log(finishReasons)
      this.finishStatus = finishReasons
    }
    this.chatModel.streamChat(
      messageHistory,
      streamAnswer,
      streamUsage,
      onFinish
    )

    return messageSent
  }
  toSave() {
    return {
      chatId: this.chatId,
      title: this.title,
      userName: this.userName,
      messageHistory: this.messageHistory.toSave()
    }
  }
  setTitle(message) {
    const messageHistory = new MessageHistory()
    messageHistory.push({
      content: `Complete the fourth pair of texts as shown in the examples. Hint: The completed result must describe the main topic of the text and must not be a question.
      1. What might be the grammar of this code => The grammar of a given piece of code\n
      2. ケーキを作る方法はありますか => ケーキのレシピを教えてください\n
      3. 为什么天空是蓝色的 => 天空是蓝色的原因\n
      4. ${message.content} =>`,
      senderId: 'me_id'
    })

    let titleBegan = false
    const streamAnswer = (ans) => {
      if (!titleBegan) {
        this.title = ans[0]
        titleBegan = true
      } else {
        this.title += ans[0].replace('.', '').replace('。', '')
      }
      // console.log(this.title)
    }
    this.chatModel.streamChat(
      messageHistory.toOpenAI(),
      streamAnswer,
      () => {},
      () => {},
      // `Predict the topic of the conversation based on the given message.
      // Your response should be informative and concise.
      // Use a verb-object phrase or nones.
      // You must Use the same language as the message.`
      'Your response must be concise and short.'
    )
  }
}
