<template>
  <vue-advanced-chat-md
    :message-actions="[]"
    :text-messages="JSON.stringify({
      ROOMS_EMPTY: '',
      ROOM_EMPTY: '点击开始新的对话以添加聊天',
      NEW_MESSAGES: 'New Messages',
      MESSAGE_DELETED: 'This message was deleted',
      MESSAGES_EMPTY: '发送消息以开始对话',
      CONVERSATION_STARTED: '对话开始于: ',
      TYPE_MESSAGE: '',
      SEARCH: '搜索',
      IS_ONLINE: 'is online',
      LAST_SEEN: 'last seen ',
      IS_TYPING: 'is writing...',
      CANCEL_SELECT_MESSAGE: 'Cancel'
    })"
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
    theme="dark"
    :styles="JSON.stringify(styles)"
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
    :send-disabled="String(!canSendMessage || preview)"
    @send-message="sendMessage($event.detail[0])"
    @fetch-messages="openChat($event.detail[0])"
    @room-action-handler="roomActionHandler($event.detail[0])"
  >
  </vue-advanced-chat-md>
</template>

<script>
import { register } from '../../../../../vue-advanced-chat-md'
import { mapGetters } from 'vuex'
import storage from '@/utils/sys/storage'

register()

export default {
  name: 'ChatWindow',
  computed: {
    ...mapGetters([
      'chats',
      'currentChatId',
      'chatModel',
      'preview',
      'currentChat'
    ]),
    rooms() {
      return this.chats.map((c, index) => {
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
      canSendMessage: true,
      styles: {
        general: {
          color: '#fff',
          colorButtonClear: '#fff',
          colorButton: '#fff',
          backgroundColorButton: '#1976d2',
          backgroundInput: '#3a3d3f',
          colorPlaceholder: '#afafaf',
          colorCaret: '#fff',
          colorSpinner: '#fff',
          borderStyle: 'none',
          backgroundScrollIcon: '#4d4d4d'
        },

        container: {
          border: 'none',
          borderRadius: 'none',
          boxShadow: 'none'
        },

        header: {
          background: '#181a1b',
          colorRoomName: '#fff',
          colorRoomInfo: '#9ca6af'
        },

        footer: {
          background: '#131415',
          borderStyleInput: 'none',
          borderInputSelected: '#1976d2',
          backgroundReply: '#1b1c1c',
          backgroundTagActive: '#1b1c1c',
          backgroundTag: '#131415'
        },

        content: {
          background: '#000000'
        },

        sidemenu: {
          background: '#181a1b',
          backgroundHover: '#ffb6f9',
          backgroundActive: '#000000',
          colorActive: '#fff',
          borderColorSearch: '#181a1b'
        },

        dropdown: {
          background: '#2a2c33',
          backgroundHover: '#26282e'
        },

        message: {
          background: '#22242a',
          backgroundMe: '#332933',
          color: '#fff',
          colorStarted: '#9ca6af',
          backgroundDeleted: '#1b1c21',
          backgroundSelected: '#c2dcf2',
          colorDeleted: '#a2a5a8',
          colorUsername: '#b3bac9',
          colorTimestamp: '#ebedf2',
          backgroundDate: 'rgba(0, 0, 0, 0.3)',
          colorDate: '#bec5cc',
          backgroundSystem: 'rgba(0, 0, 0, 0.3)',
          colorSystem: '#bec5cc',
          backgroundMedia: 'rgba(0, 0, 0, 0.18)',
          backgroundReply: 'rgba(0, 0, 0, 0.18)',
          colorReplyUsername: '#fff',
          colorReply: '#d6d6d6',
          colorTag: '#f0c60a',
          backgroundImage: '#ddd',
          colorNewMessages: '#fff',
          backgroundScrollCounter: '#1976d2',
          colorScrollCounter: '#fff',
          backgroundReaction: 'none',
          borderStyleReaction: 'none',
          backgroundReactionHover: '#202223',
          borderStyleReactionHover: 'none',
          colorReactionCounter: '#fff',
          backgroundReactionMe: '#4e9ad1',
          borderStyleReactionMe: 'none',
          backgroundReactionHoverMe: '#4e9ad1',
          borderStyleReactionHoverMe: 'none',
          colorReactionCounterMe: '#fff',
          backgroundAudioRecord: '#eb4034',
          backgroundAudioLine: 'rgba(255, 255, 255, 0.15)',
          backgroundAudioProgress: '#b7d4d3',
          backgroundAudioProgressSelector: '#b7d4d3',
          colorFileExtension: '#a2a5a8'
        },

        markdown: {
          background: 'rgba(239, 239, 239, 0.7)',
          border: 'rgba(212, 212, 212, 0.9)',
          color: '#e01e5a',
          colorMulti: '#0a0a0a'
        },

        room: {
          colorUsername: '#fff',
          colorMessage: '#6c7278',
          colorTimestamp: '#6c7278',
          colorStateOnline: '#4caf50',
          colorStateOffline: '#596269',
          backgroundCounterBadge: '#1976d2',
          colorCounterBadge: '#fff'
        },

        emoji: {
          background: '#343740'
        },

        icons: {
          search: '#afafaf',
          add: '#fff',
          toggle: '#fff',
          menu: '#fff',
          close: '#9ca6af',
          closeImage: '#fff',
          file: '#1976d2',
          paperclip: '#fff',
          closeOutline: '#fff',
          closePreview: '#fff',
          send: '#fff',
          sendDisabled: '#646a70',
          emoji: '#fff',
          emojiReaction: '#fff',
          document: '#1976d2',
          pencil: '#ebedf2',
          checkmark: '#ebedf2',
          checkmarkSeen: '#f0d90a',
          eye: '#fff',
          dropdownMessage: '#fff',
          dropdownMessageBackground: 'rgba(0, 0, 0, 0.25)',
          dropdownRoom: '#fff',
          dropdownScroll: '#fff',
          microphone: '#fff',
          audioPlay: '#b7d4d3',
          audioPause: '#b7d4d3',
          audioCancel: '#eb4034',
          audioConfirm: '#1ba65b'
        }
      }
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
      this.vacHeight = window.innerHeight - 51
    },
    getStreamingMessage(currentChat, messageContent) {
      const messagesBefore = currentChat.getMessageHistory()
      currentChat.streamNextMessage(
        {
          content: messageContent,
          senderId: 'me_id'
        },
        () => {},
        (appendMessages) => {
          if (currentChat.chatId === this.currentChatId) {
            this.messages = [...messagesBefore, ...appendMessages]
          }
        },
        () => {
          this.canSendMessage = true
          storage.saveChats()
        }
      )
    },
    getMessageFromModel(...args) {
      this.canSendMessage = false
      this.getStreamingMessage(...args)
    },
    openChat({ room, options }) {
      this.$store.commit('chat/setCurrentChatId', room.roomId)
      this.messages = this.currentChat.getMessageHistory()
    },
    sendMessage({ roomId, content, files, replyMessage, usersTag }) {
      this.getMessageFromModel(this.currentChat, content)
    },
    roomActionHandler({ roomId, action }) {
      switch (action.name) {
        case 'remove':
          this.$store.commit('chat/removeChatById', roomId)
          setTimeout(() => {
            this.$emit('add-chat')
          }, 0)
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
