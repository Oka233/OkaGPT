import { v4 as uuidv4 } from 'uuid'
import { MessageHistory } from '@/utils/Chat/MessageHistory'
import { users, roles } from '@/utils/Chat/users'
import store from '@/store'

export class Chat {
  constructor({ chatId, title, userName, messageHistory }) {
    this.chatId = chatId || uuidv4()
    this.title = title || '新的对话'
    this.userName = userName || 'GPT'
    this.messageHistory = new MessageHistory(messageHistory)
    // 注册用户
    users[this.chatId] = this.userName
    roles[this.chatId] = 'assistant'
    // 使用全局模型
    this.chatModel = store.getters.chatModel
    this.finishStatus = ['waiting']
  }
  getMessageHistory() {
    return this.messageHistory.toVAC()
  }
  streamNextMessage(message, onBegin, onReceive, onFinish) {
    if (this.messageHistory.len() === 0) {
      this.setTitle(message)
    }
    // 上一次消息的n不一定和这次相同，这里假定相同
    this.finishStatus = Array(this.finishStatus.length).fill('waiting')
    this.messageHistory.push(message)
    onReceive(this.messageHistory.toVAC().slice(-1))
    // 需要在push用户输入和push空消息之间生成给gpt的对话列表
    const messageHistory = this.messageHistory.toOpenAI()
    this.chatModel.streamChat(
      messageHistory,
      () => {
        this.messageHistory.push({
          content: '',
          senderId: this.chatId
        })
      },
      ({ reply, usage, finishReasons }) => {
        const answerNum = this.messageHistory.streamMessage(reply)
        const appendMessages = this.messageHistory.toVAC().slice(-(answerNum + 1))
        onReceive(appendMessages)
        this.messageHistory.streamUsage(usage)
        this.finishStatus = finishReasons
      },
      onFinish
    )
  }
  toSave() {
    return {
      chatId: this.chatId,
      title: this.title,
      userName: this.userName,
      messageHistory: this.messageHistory.toSave()
    }
  }
  setTitle({ content }) {
    this.title = content
  }
}
