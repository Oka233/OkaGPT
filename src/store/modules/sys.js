import { IChatModel } from '@/utils/Models/IChatModel'

const state = {
  platformType: null,
  chatModel: null,
  ready: false,
  preview: false,
  loadedSave: false
}

const mutations = {
  setPlatformType: (state, platformType) => {
    state.platformType = platformType
  },
  setChatModel: (state, platformType) => {
    state.chatModel = new IChatModel(platformType)
  },
  readyToGo: (state) => {
    state.preview = false
    state.ready = true
  },
  engagePreviewMode: (state) => {
    state.preview = true
  },
  load: (state, save) => {
    if (save) {
      for (const key in save) {
        if (key in state) {
          state[key] = save[key]
        }
      }
    }
    if (state.platformType) {
      state.chatModel = new IChatModel(state.platformType)
      state.chatModel.loadSettings()
    }
    state.ready = false
    state.preview = false
    state.loadedSave = true
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
