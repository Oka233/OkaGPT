import { Configuration, OpenAIApi } from 'openai'
import storage from '@/utils/storage.js'

export class OpenAI {
  constructor() {
    this.apiKey = storage.get('settings.openaiKey')
    if (this.apiKey) {
      this.init()
    } else {
      console.log('OpenAI key not found')
    }
  }
  init() {
    const configuration = new Configuration({
      organization: '',
      apiKey: this.apiKey
    })
    delete configuration.baseOptions.headers['User-Agent']
    this.openai = new OpenAIApi(configuration)
  }
  listEngines() {
    return this.openai.listEngines()
  }
  async chat(messageHistory) {
    const messages = messageHistory.toOpenAI()
    console.log('request', messages)
    return this.openai.createChatCompletion(
      {
        model: storage.get('settings.model'),
        messages: [
          { 'role': 'system', 'content': 'Start a conversation with your greeting.' },
          ...messages
        ],
        temperature: 0
      }
    )
  }
}
