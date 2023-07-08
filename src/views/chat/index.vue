<template>
  <div class="dashboard-container">
    <ChatWindow
      class="chat-left"
      @add-chat="addChat"
    />
    <div class="chat-right">
      <el-button type="primary" @click="addChat">开始新的对话</el-button>
<!--      <el-button type="primary" @click="storage.saveChats">保存对话 (localstorage)</el-button>-->
      <el-button
        :type="removeButtonStateOptions[removeButtonState].type"
        @click="removeAllChats"
      >{{ removeButtonStateOptions[removeButtonState].text }}</el-button>
      <ChatSettings />
      <ChatStatus />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatSettings from '@/components/Chat/ChatSettings/index.vue'
import ChatStatus from '@/components/Chat/ChatStatus/index.vue'
import storage from '@/utils/sys/storage'
import { Chat } from '@/utils/Chat/Chat'
import ChatWindow from '@/components/Chat/ChatWindow/index.vue'

export default {
  name: 'Chat',
  components: { ChatWindow, ChatStatus, ChatSettings },
  data() {
    return {
      storage: storage,
      removeButtonState: 'normal',
      removeButtonStateOptions: {
        normal: {
          text: '清空对话历史',
          type: 'primary'
        },
        confirm: {
          text: '确认清空',
          type: 'danger'
        },
        done: {
          text: '已清空',
          type: 'primary'
        }
      },
      removeButtonStateTimer: null
    }
  },
  computed: {
    ...mapGetters([
      'chats'
    ])
  },
  mounted() {
    if (!this.chats.length) {
      this.addChat()
    }
  },
  methods: {
    removeAllChats() {
      if (this.removeButtonState === 'done') {
        return
      }
      if (this.removeButtonState === 'normal') {
        this.removeButtonState = 'confirm'
        clearTimeout(this.removeButtonStateTimer)
        this.removeButtonStateTimer = setTimeout(() => {
          this.removeButtonState = 'normal'
        }, 3000)
        return
      }
      if (this.removeButtonState === 'confirm') {
        this.$store.commit('chat/removeAllChats')
        setTimeout(() => {
          this.addChat()
        }, 1)
        // this.addChat()
        this.removeButtonState = 'done'
        clearTimeout(this.removeButtonStateTimer)
        this.removeButtonStateTimer = setTimeout(() => {
          this.removeButtonState = 'normal'
        }, 1500)
      }
    },
    addChat() {
      this.$store.commit('chat/addChat', new Chat({}))
      storage.saveChats()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    //margin: 12px;
    display: flex;
    gap: 8px;
    .chat-left {
      flex: 1;
    }
    .chat-right {
      flex-basis: 300px;
      display: flex;
      flex-flow: column;
      padding-right: 8px;
      gap: 8px;
      height: calc(100vh - 50px);
      overflow: auto;
    }
  }
  //&-text {
  //  font-size: 30px;
  //  line-height: 46px;
  //}
}
.el-button {
  margin-left: 0;
}
</style>
