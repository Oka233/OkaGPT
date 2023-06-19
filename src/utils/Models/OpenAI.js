import { Configuration, OpenAIApi } from 'openai'
import { Message } from 'element-ui'
import storage from '@/utils/storage'
import store from '@/store'

export class OpenAI {
  sysMessage = 'If any code block exists in your message, add corresponding language type for it. Start a conversation with your greeting.'
  constructor() {
    const configuration = new Configuration({
      organization: '',
      apiKey: OpenAI.getSetting('apiKey')
    })
    delete configuration.baseOptions.headers['User-Agent']
    this.openai = new OpenAIApi(configuration)
  }
  static async verifyKey(key) {
    key = key || this.getSetting('apiKey')
    const configuration = new Configuration({
      apiKey: key
    })
    // delete configuration.baseOptions.headers['User-Agent']
    return new Promise((resolve, reject) => {
      new OpenAIApi(configuration).listModels()
        .then(res => {
          storage.set('openai.apiKey', key)
          const len = res.data.data.filter(item => item.id.indexOf('gpt') > -1).length
          console.log(res.data.data.map(item => item.id))
          resolve(`API key已验证。当前有${len}个GPT模型可用`)
        })
        .catch(e => {
          reject(e.response.data.error)
        })
    })
  }
  static loadSettings() {
    this.runningSettings = store.getters.openaiSettings
  }
  static saveSettings() {
    storage.set('openai', this.runningSettings)
  }
  static getModels() {
    const configuration = new Configuration({
      apiKey: OpenAI.getSetting('apiKey')
    })
    return new Promise((resolve, reject) => {
      new OpenAIApi(configuration).listModels()
        .then(res => {
          const models = res.data.data.filter(item => item.id.indexOf('gpt') > -1).map(item => item.id)
          resolve(models)
        })
        .catch(e => {
          reject(e.response.data.error)
        })
    })
  }
  static getSetting(key) {
    if (key in store.getters.openaiAdvancedTabCheckboxes) {
      if (store.getters.openaiAdvancedTabCheckboxes[key]) {
        return this.runningSettings[key]
      } else {
        return undefined
      }
    } else {
      return this.runningSettings[key]
    }
  }
  listEngines() {
    return this.openai.listEngines()
  }
  async chat(messageHistory) {
    const messages = messageHistory.toOpenAI()
    console.log('request', messages)
    return this.openai.createChatCompletion(
      {
        model: OpenAI.getSetting('model'),
        messages: [
          { 'role': 'system', 'content': this.sysMessage },
          ...messages
        ],
        temperature: 0
      }
    )
  }
  async streamChat(messages, callback1 = () => {}, callback2 = () => {}) {
    const splitRes = (str) => {
      // console.log(str)
      let count = str.split(',"finish_reason":').length - 1
      // console.log(count)
      const res = []
      let rest = str
      while (count-- > 1) {
        const pos = rest.indexOf(',"finish_reason":')
        let split = rest
        rest = rest.slice(pos)
        const pos2 = rest.indexOf('{')
        rest = rest.slice(pos2, rest.lastIndexOf('}') + 1)
        split = split.slice(0, pos + pos2 + 1)
        split = split.slice(0, split.lastIndexOf('}') + 1)
        res.push(split)
      }
      res.push(rest.slice(rest.indexOf('{'), rest.lastIndexOf('}') + 1))
      // console.log(res)
      return res
    }

    const body = {
      model: OpenAI.getSetting('model'),
      messages: [
        { 'role': 'system', 'content': this.sysMessage },
        ...messages
      ],
      stream: true
    }
    const addSetting = ['temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'max_tokens']
    addSetting.forEach(key => {
      const value = OpenAI.getSetting(key)
      if (value !== undefined) {
        body[key] = value
      }
    })
    console.log('request', body)
    const response = await fetch('https://api.openai.com/v1/chat/completions',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + OpenAI.getSetting('apiKey')
        },
        method: 'POST',
        body: JSON.stringify(body)
      }
    )
    callback1(new Array(body.n || 1).fill(''))

    // console.log('response', response)
    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()

    while (1) {
      const res = await reader.read()
      if (res?.done) {
        break
      }
      if (!res?.value) {
        continue
      }
      const str = res.value.slice(res.value.indexOf('{'), res.value.lastIndexOf('}') + 1)
      if (response?.status !== 200) {
        const e = JSON.parse(str)
        Message({
          message: e.error.message,
          type: 'error'
        })
        break
      }

      const jsons = splitRes(str).map(j => JSON.parse(j))
      // console.log(jsons)
      const ans = new Array(body.n || 1).fill('')
      const finishReasons = new Array(body.n || 1)
      const usage = {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
      jsons.forEach(json => {
        const index = json.choices[0]?.index
        if (index !== undefined) {
          ans[index] += json.choices[0].delta?.content || ''
          finishReasons[index] = json.choices[0].finish_reason
        }
        // usage.prompt_tokens += json.usage.prompt_tokens
        // usage.completion_tokens += json.usage.completion_tokens
        // usage.total_tokens += json.usage.total_tokens
      })
      callback1(ans)
      callback2(usage, finishReasons)
      // const json = JSON.parse(jsonStr)
      // console.log(jsons)
    }
  }
  async completion(prompt) {
    return this.openai.createCompletion({
      model: OpenAI.getSetting('model'),
      prompt: prompt
    })
  }
}
