import router from './router'
import store from './store'
import { Message, Loading } from 'element-ui'
import storage from '@/utils/storage'

router.beforeEach(async(to, from, next) => {
  if (!store.getters.loadedSave) {
    // 加载存储的数据，除了这里，不应再出现对sys和openai的storage.get
    storage.load()
  }
  if (to.path === '/chat') {
    if (store.getters.ready) {
      next()
    } else if (store.getters.platformType) {
      // 根据存储的key进行验证
      try {
        const loadingInstance = Loading.service({
          text: '正在验证API key...'
        })
        const message = await store.getters.chatModel.verifyKey()
        // setTimeout(() => {
        loadingInstance.close()
        // }, 100)
        Message.success(message)
        store.getters.chatModel.init()
        store.commit('sys/ready', true)
        next()
      } catch (e) {
        Message.error(`本地设置过期，请重新设置。${e.message}}`)
        next({ path: '/start-wizard' })
      }
    } else {
      // 未设置过key,跳转到设置页面
      Message.warning('请先填写初始设置')
      next({ path: '/start-wizard' })
    }
  } else {
    next()
  }
})

router.afterEach(() => {
})
