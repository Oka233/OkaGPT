<template>
  <vue-advanced-chat
    :class="{disabled: chatDisabled}"
    :height="`${vacHeight}px`"
    :show-audio="'false'"
    :show-new-messages-divider="'false'"
    :username-options="JSON.stringify({minUsers: 1, currentUser: true})"
    :show-emojis="'false'"
    :show-reaction-emojis="'false'"
    :emojis-suggestion-enabled="'false'"
    :loading-rooms="loadingRooms.toString()"
    :rooms-loaded="roomsLoaded.toString()"
    :messages-loaded="messagesLoaded.toString()"
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
    @send-message="sendMessage($event.detail[0])"
    @fetch-messages="fetchMessages($event.detail[0])"
  >
  </vue-advanced-chat>
</template>

<script>
import { register } from 'vue-advanced-chat'
import { showErrorMessage } from '@/utils/Models/openaiErrorMessage'
import storage from '@/utils/storage'
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
      'currentRoomId'
    ]),
    rooms() {
      const rooms = this.chats.map((c, index) => {
        return {
          roomId: `${c.chatId}`,
          roomName: `Chat ${index}`,
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
      rooms.typingUsers = this.typingUsers
      return rooms
    }
  },
  data() {
    return {
      vacHeight: null,
      loadingRooms: false,
      roomsLoaded: true,
      messagesLoaded: true,
      currentUserId: 'me_id',
      messages: [],
      roomActions: [
        { name: 'remove', title: '删除对话' },
        { name: 'export', title: '导出对话' }
      ],
      typingUsers: []
    }
  },
  created() {
  },
  mounted() {
    if (storage.get('openaiSettings.autoStart')) {
      this.$emit('add-chat')
    }
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
          showErrorMessage(e)
        })
    },
    getStreamingMessage(currentChat, messageContent) {
      // this.typingUsers.push(currentChat.chatId)
      const messagesBefore = currentChat.getMessageHistory()
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
      const message = messageContent !== undefined ? { content: messageContent, senderId: 'me_id' } : undefined
      const messageSent = currentChat.streamNextMessage(message, streamAnswer)
      if (messageSent) {
        this.messages = [...this.messages, ...messageSent]
      }
    },
    getMessage(...args) {
      if (storage.get('openaiSettings.stream')) {
        this.getStreamingMessage(...args)
      } else {
        this.getNoneStreamingMessage(...args)
      }
    },
    fetchMessages({ room, options }) {
      // this.messagesLoaded = false
      this.$store.commit('chatSettings/SET_ROOM_ID', room.roomId)
      setTimeout(() => {
        const currentChat = this.chats.find(c => c.chatId === this.currentRoomId)
        const messageHistory = currentChat.getMessageHistory()
        if (messageHistory.length === 0) {
          this.getMessage(currentChat)
        } else {
          this.messages = messageHistory
        }
        // this.messagesLoaded = true
      })
    },
    sendMessage({ roomId, content, files, replyMessage, usersTag }) {
      const currentChat = this.chats.find(c => c.chatId === roomId)
      this.getMessage(currentChat, content)
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
