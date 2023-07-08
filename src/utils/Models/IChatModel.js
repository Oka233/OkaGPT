import { OpenAI } from '@/utils/Models/OpenAI'

export class IChatModel {
  chatModelClass = null
  chatModel = null
  platformType = null
  constructor(platformType) {
    this.platformType = platformType
    switch (platformType) {
      case 'openai':
        this.chatModelClass = OpenAI
    }
  }
  init(...args) {
    this.chatModel = new this.chatModelClass(...args)
  }
  async verifyKey(...args) {
    return this.chatModelClass.verifyKey(...args)
  }
  loadSettings(settings) {
    this.chatModelClass.loadSettings(settings)
  }
  getAvailableModels() {
    return this.chatModelClass.getAvailableModels()
  }
  streamChat(
    messages,
    onBegin,
    onReceive,
    onFinish,
    sysMessage
  ) {
    return this.chatModel.streamChat(
      messages,
      onBegin,
      onReceive,
      onFinish,
      sysMessage
    )
  }
}
