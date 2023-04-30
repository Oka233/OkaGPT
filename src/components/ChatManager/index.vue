<template>
  <div :class="{disabled: disabled}">
<!--    <el-button @click="addChat">new chat</el-button>-->
    <ChatContainer
      :chats="chats"
    />
  </div>
</template>

<script>
import ChatContainer from '@/components/ChatContainer/index.vue'
import GPTUtils from '@/utils/Chat/Chat'
import storage from '@/utils/storage'

export default {
  name: 'ChatManager',
  components: { ChatContainer },
  props: {
    getSetting: {
      type: Function
    }
    // activeChat: {
    //   type: Object
    // }
  },
  watch: {
    // ready: {
    //   handler: function(val) {
    //     if (val) {
    //       this.chats.push(GPTUtils.getChat())
    //     }
    //   }
    // }
  },
  data() {
    return {
      chats: [],
      disabled: false
    }
  },
  mounted() {
    // if (!this.chats.length) {
    //   this.chats.push(GPTUtils.getChat())
    // }
    if (storage.get('openaiSettings.autoStart')) {
      this.addChat()
    }
  },
  methods: {
    addChat() {
      if (!storage.get('openaiSettings.apiKey')) {
        if (!storage.get('openaiSettings.autoStart')) {
          this.$message({
            message: 'Please set your OpenAI API key first',
            type: 'warning'
          })
        }
        return
      }
      this.chats.push(GPTUtils.getChat({
        getSetting: this.getSetting
      }))
    },
    allowChat() {
      this.disabled = false
    },
    freezeChat() {
      this.disabled = true
    }
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
