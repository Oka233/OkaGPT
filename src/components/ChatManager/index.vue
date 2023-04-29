<template>
  <div>
    <el-button @click="addChat">new chat</el-button>
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
    activeChat: {
      type: Object
    },
  },
  data() {
    return {
      chats: []
    }
  },
  mounted() {
    if (!this.chats.length) {
      this.chats.push(GPTUtils.getChat())
    }
  },
  methods: {
    addChat() {
      this.chats.push(GPTUtils.getChat())
    }
  }
}
</script>

<style scoped>

</style>
