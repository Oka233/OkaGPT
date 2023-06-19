<template>
  <div class="dashboard-container">
    <ChatContainer
      class="chat-left"
      @save="saveChats(false)"
    />
    <div class="chat-right">
      <el-button type="primary" @click="addChat">开始新的对话</el-button>
      <el-button type="primary" @click="saveChats">保存对话 (localstorage)</el-button>
      <el-button type="primary" @click="removeAllChats">清空对话历史</el-button>
      <ChatSettings />
      <ChatStatus />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatSettings from '@/components/ChatSettings/index.vue'
import ChatStatus from '@/components/ChatStatus/index.vue'
import storage from '@/utils/storage'
import { Chat } from '@/utils/Chat/Chat'
import ChatContainer from '@/components/ChatContainer/index.vue'

export default {
  name: 'Dashboard',
  components: { ChatContainer, ChatStatus, ChatSettings },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'chats'
    ])
  },
  methods: {
    saveChats(notify = true) {
      const savedChats = this.chats.map(chat => {
        return chat.toSave()
      })
      storage.set('savedChats', JSON.stringify(savedChats))
      if (notify) this.$message.success('对话列表已保存')
    },
    removeAllChats() {
      this.$store.commit('chat/REMOVE_ALL_CHATS')
      this.saveChats(false)
      this.$message.success('对话历史已删除')
    },
    addChat() {
      this.$store.commit('chat/ADD_CHAT', new Chat())
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
