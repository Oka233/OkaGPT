<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <ChatContainer
      class="chat-left"
      @add-chat="addChat"
    />
    <div class="chat-right">
      <el-button type="primary" @click="addChat">Start New Chat</el-button>
      <el-button type="primary" @click="saveChats">Save Chats</el-button>
      <el-button type="primary" @click="removeChats">Remove Chats</el-button>
      <ChatSettings/>
      <ChatStatus/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatSettings from '@/components/ChatSettings/index.vue'
import ChatStatus from '@/components/ChatStatus/index.vue'
import storage from '@/utils/storage'
import GPTUtils from '@/utils/Chat/Chat'
import ChatContainer from '@/components/ChatContainer/index.vue'

export default {
  name: 'Dashboard',
  components: { ChatContainer, ChatStatus, ChatSettings },
  computed: {
    ...mapGetters([
      'chats'
    ])
  },
  data() {
    return {
    }
  },
  mounted() {
    this.loadSavedChats()
  },
  methods: {
    saveChats(notify = true) {
      const savedChats = this.chats.map(chat => {
        return chat.toSave()
      })
      storage.set('savedChats', JSON.stringify(savedChats))
      if (notify) {
        this.$message({
          message: 'Chats saved',
          type: 'success'
        })
      }
    },
    removeChats() {
      this.$store.commit('chat/REMOVE_CHATS')
      this.saveChats(false)
      this.$message({
        message: 'Chats removed',
        type: 'success'
      })
    },
    loadSavedChats() {
      this.$store.commit('chat/REMOVE_CHATS')
      let savedChats = storage.get('savedChats')
      if (savedChats) {
        savedChats = JSON.parse(savedChats)
        savedChats.forEach(chat => {
          this.$store.commit('chat/ADD_CHAT', GPTUtils.getChat({
            ...chat
          }))
        })
      }
    },
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
      this.$store.commit('chat/ADD_CHAT', GPTUtils.getChat({
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 12px;
    display: flex;
    gap: 8px;
    .chat-left {
      flex: 1;
    }
    .chat-right {
      flex-basis: 300px;
      display: flex;
      flex-flow: column;
      gap: 8px;
    }
  }
  //&-text {
  //  font-size: 30px;
  //  line-height: 46px;
  //}
}
.el-button {
  margin-left: 0px;
}
</style>
