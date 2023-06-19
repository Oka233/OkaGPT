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
    // eslint-disable-next-line new-cap
    this.chatModel = new this.chatModelClass(...args)
  }
  async verifyKey(...args) {
    return this.chatModelClass.verifyKey(...args)
  }
  loadSettings(settings) {
    this.chatModelClass.loadSettings(settings)
  }
  saveSettings() {
    this.chatModelClass.saveSettings()
  }
  getSetting(key) {
    return this.chatModelClass.getSetting(key)
  }
  getModels() {
    return this.chatModelClass.getModels()
  }
  chat(...args) {
    return this.chatModel.chat(...args)
  }
  streamChat(...args) {
    return this.chatModel.streamChat(...args)
  }
  completion(...args) {
    return this.chatModel.completion(...args)
  }
}
