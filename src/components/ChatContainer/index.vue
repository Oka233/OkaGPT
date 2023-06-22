<template>
  <vue-advanced-chat-md
    :message-actions="[]"
    :text-messages="JSON.stringify({
      ROOMS_EMPTY: '',
      ROOM_EMPTY: '点击开始新的对话按钮以添加聊天',
      NEW_MESSAGES: 'New Messages',
      MESSAGE_DELETED: 'This message was deleted',
      MESSAGES_EMPTY: '输入消息以开始新的对话',
      CONVERSATION_STARTED: '对话开始于: ',
      TYPE_MESSAGE: '',
      SEARCH: '搜索',
      IS_ONLINE: 'is online',
      LAST_SEEN: 'last seen ',
      IS_TYPING: 'is writing...',
      CANCEL_SELECT_MESSAGE: 'Cancel'
    })"
    :class="{disabled: chatDisabled}"
    show-add-room="false"
    show-files="false"
    :height="`${vacHeight}px`"
    show-audio="false"
    show-new-messages-divider="false"
    show-emojis="false"
    show-reaction-emojis="false"
    emojis-suggestion-enabled="false"
    loading-rooms="false"
    rooms-loaded="true"
    messages-loaded="true"
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
    :send-disabled="String(!canSendMessage)"
    @send-message="sendMessage($event.detail[0])"
    @fetch-messages="openChat($event.detail[0])"
    @room-action-handler="roomActionHandler($event.detail[0])"
  >
  </vue-advanced-chat-md>
</template>

<script>
import { register } from 'vue-advanced-chat-md'
import { mapGetters } from 'vuex'
register()

export default {
  name: 'ChatContainer',
  props: {
    addChat: {
      type: Function
    }
  },
  computed: {
    ...mapGetters([
      'chats',
      'chatDisabled',
      'currentRoomId',
      'chatModel'
    ]),
    rooms() {
      const rooms = this.chats.map((c, index) => {
        return {
          roomId: `${c.chatId}`,
          roomName: c.title,
          index: index,
          users: [
            {
              _id: c.chatId,
              username: c.userName
            },
            {
              _id: 'me_id',
              username: 'Me'
            }
          ]
        }
      })
      return rooms
    },
    currentChat() {
      return this.chats.find(c => c.chatId === this.currentRoomId)
    }
  },
  data() {
    return {
      vacHeight: null,
      currentUserId: 'me_id',
      messages: [],
      roomActions: [
        { name: 'export', title: '导出' },
        { name: 'remove', title: '删除' }
      ],
      canSendMessage: true
    }
  },
  mounted() {
    this.resizeHandler()
    window.onresize = () => {
      return (() => {
        this.resizeHandler()
      })()
    }
    // messages必须在mounted后加入才能有效
    // this.messages = this.addMessages(true)
  },
  methods: {
    resizeHandler() {
      this.vacHeight = window.innerHeight - 80
    },
    getNoneStreamingMessage(currentChat, messageContent) {
      const messagesBefore = currentChat.getMessageHistory()
      const message = messageContent !== undefined ? { content: messageContent, senderId: 'me_id' } : undefined
      const [messagePromise, messageSent] = currentChat.nextMessage(message)
      if (message) {
        // 如果这里不使用messagesBefore而是直接使用this.messages，会导致切换room后加载到错误的消息
        this.messages = [...messagesBefore, ...messageSent]
      }
      messagePromise
        .then(res => {
          if (currentChat.chatId === this.currentRoomId) {
            this.messages = messageSent
              ? [...messagesBefore, ...messageSent, ...res]
              : [...messagesBefore, ...res]
          }
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    getStreamingMessage(currentChat, messageContent, files) {
      // this.typingUsers.push(currentChat.chatId)
      const messagesBefore = currentChat.getMessageHistory()
      // 切换到新的聊天时，先提供一个空消息，不然新聊天显示会延迟。这个空消息在streamAnswer中会被替换掉
      if (messagesBefore.length === 0 && this.chatModel.getSetting('hello')) {
        this.messages = currentChat.getBlankMessage()
      }
      const streamAnswer = (messages, messageSent, isLast) => {
        if (currentChat.chatId === this.currentRoomId) {
          this.messages = messageSent
            ? [...messagesBefore, ...messageSent, ...messages]
            : [...messagesBefore, ...messages]
        }
        // if (isLast) {
        //   this.typingUsers = this.typingUsers.filter(u => u !== currentChat.chatId)
        // }
      }
      const onFinish = () => {
        this.canSendMessage = true
      }
      console.log(files)
      // console.log(files.length)
      const message = messageContent !== undefined ? { content: messageContent, files: files, senderId: 'me_id' } : undefined
      const messageSent = currentChat.streamNextMessage(message, streamAnswer, onFinish)
      if (messageSent) {
        this.messages = [...this.messages, ...messageSent]
      }
    },
    getMessageFromModel(...args) {
      if (this.chatModel.getSetting('stream')) {
        this.canSendMessage = false
        this.getStreamingMessage(...args)
      } else {
        this.getNoneStreamingMessage(...args)
      }
    },
    openChat({ room, options }) {
      this.$store.commit('chat/SET_ROOM_ID', room.roomId)
      const messageHistory = this.currentChat.getMessageHistory()
      if (messageHistory.length === 0 && this.chatModel.getSetting('hello')) {
        // 问候语
        this.getMessageFromModel(this.currentChat)
      } else {
        this.messages = messageHistory
      }
    },
    sendMessage({ roomId, content, files, replyMessage, usersTag }) {
      this.getMessageFromModel(this.currentChat, content, files)
    },
    roomActionHandler({ roomId, action }) {
      switch (action.name) {
        case 'remove':
          this.$store.commit('chat/REMOVE_CHAT', roomId)
          this.$emit('save')
          break
        case 'export':
          this.$message.warning('导出功能尚未实现')
          break
        default:
          this.$message.warning('未注册的动作')
      }
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
