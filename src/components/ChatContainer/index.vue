<template>
  <vue-advanced-chat
    :username-options="JSON.stringify({minUsers: 1, currentUser: true})"
    :show-emojis="'false'"
    :show-reaction-emojis="'false'"
    :emojis-suggestion-enabled="'false'"
    :loading-rooms="loadingRooms.toString()"
    :loading-messages="loadingMessages.toString()"
    :rooms-loaded="roomsLoaded.toString()"
    :messages-loaded="messagesLoaded.toString()"
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
    @send-message="sendMessage($event.detail[0])"
    @fetch-messages="fetchMessages($event.detail[0])"
  />
</template>

<script>
import { register } from 'vue-advanced-chat'
import { showErrorMessage } from '@/utils/Models/openaiErrorMessage'
register()

export default {
  name: 'ChatContainer',
  props: {
    chats: {
      required: false
    },
    // messages: {
    //   required: false
    // }
  },
  computed: {
    rooms() {
      return this.chats.map((c, index) => {
        return {
          roomId: `${c.chatId}`,
          roomName: `Room ${index}`,
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
    }
  },
  data() {
    return {
      loadingRooms: false,
      loadingMessages: false,
      roomsLoaded: true,
      messagesLoaded: true,
      currentUserId: 'me_id',
      currentRoomId: null,
      messages: [],
      roomActions: [
        { name: 'remove', title: '删除对话' },
        { name: 'export', title: '导出对话' }
      ]
    }
  },
  created() {
    console.log(this._data)
  },
  mounted() {
    // messages必须在mounted后加入才能有效
    // this.messages = this.addMessages(true)
  },
  methods: {
    fetchMessages({ room, options }) {
      this.currentRoomId = room.roomId
      console.log('fetchMessage', room, options)
      setTimeout(() => {
        const currentChat = this.chats[room.index]
        // if (options.reset) {
        const [messagePromise, _] = currentChat.nextMessage()
        messagePromise.then(res => {
          this.messages = [...res]
          // setTimeout(_ => {
          //   res[0].content = 'Yooooooo7777'
          //   this.messages = [...res]
          // }, 200)
          // setTimeout(_ => {
          //   res[0].content = 'Yooooooo77778888'
          //   this.messages = [...res]
          // }, 400)
          // setTimeout(_ => {
          //   res[0].content = 'Yooooooo77778888\n1234'
          //   this.messages = [...res]
          // }, 600)
          // setTimeout(_ => {
          //   res[0].content = 'Yooooooo77778888\n12345678'
          //   this.messages = [...res]
          //   console.log(this.messages)
          // }, 800)
        })

        this.messagesLoaded = true
      })
    },
    sendMessage({ roomId, content, files, replyMessage, usersTag }) {
      console.log('sendMessage', content)
      const currentChat = this.chats.find(c => c.chatId === roomId)
      const [messagePromise, messageSent] = currentChat.nextMessage({
        senderId: 'me_id',
        content: content
      })
      this.messages = [...this.messages, ...messageSent]
      messagePromise
        .then(res => {
          if (currentChat.chatId === this.currentRoomId) {
            this.messages = [...this.messages, ...res]
          }
        })
        .catch(e => {
          showErrorMessage(e)
        })
    }
  }
}
</script>

<style scoped>

</style>
