import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import chat from './modules/chat'
import sys from './modules/sys'
import openai from './modules/openai'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    chat,
    sys,
    openai
  },
  getters
})

export default store
