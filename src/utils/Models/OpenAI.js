import { Configuration, OpenAIApi } from 'openai'
import { Message } from 'element-ui'

export class OpenAI {
  constructor(options) {
    this.getSetting = options.getSetting
    this.apiKey = this.getSetting('apiKey')
    if (this.apiKey) {
      this.init()
    } else {
      Message({
        message: 'Please set your OpenAI API key first',
        type: 'warning'
      })
    }
  }
  static getDefaultSettings() {
    return (() => {
      return {
        name: 'openaiSettings',
        // advancedOnes: ['temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'logit_bias', 'max_tokens'],
        detail: {
          apiKey: '',
          model: '',
          autoStart: true,
          stream: true,
          temperature: 1,
          top_p: 1,
          n: 1,
          stop: null,
          presence_penalty: 0,
          frequency_penalty: 0,
          logit_bias: null,
          max_tokens: 2048
        }
      }
    })()
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
        model: this.getSetting('model'),
        messages: [
          { 'role': 'system', 'content': 'Start a conversation with your greeting.' },
          ...messages
        ],
        temperature: 0
      }
    )
  }
  async streamChat(messages, callback) {
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
      model: this.getSetting('model'),
      messages: [
        { 'role': 'system', 'content': 'Start a conversation with your greeting.' },
        ...messages
      ],
      stream: true
    }
    const addSetting = ['temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'max_tokens']
    addSetting.forEach(key => {
      const value = this.getSetting(key)
      if (value !== undefined) {
        body[key] = value
      }
    })
    console.log('request', body)
    const response = await fetch('https://api.openai.com/v1/chat/completions',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.apiKey
        },
        method: 'POST',
        body: JSON.stringify(body)
      }
    )

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
      jsons.forEach(json => {
        const index = json.choices[0]?.index
        if (index !== undefined) {
          ans[index] += json.choices[0].delta?.content || ''
        }
      })
      callback(ans)
      // const json = JSON.parse(jsonStr)
      // console.log(json)
    }
  }
}
