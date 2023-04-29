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

export default {
  name: 'ChatManager',
  components: { ChatContainer },
  prop: {
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
  },
  methods: {
    addChat() {
      this.chats.push(GPTUtils.getChat())
    },
    startChat() {
      this.disabled = false
      this.chats.push(GPTUtils.getChat())
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
