<template>
  <q-page>
    <div class="q-pa-md row items-start q-gutter-md">
      <div v-if="boardId !== null">
        <div class="row items-start">
        <q-input filled readonly v-model="inviteUrl" class="text-center" style="max-width: 10em" />
        <q-btn v-if="inviteCode" flat :aria-label="$t('boards.copy_link')" @click="copyInviteLink" color="primary" icon="content_copy" />
        </div>
        <q-card class="row no-wrap" style="width: 90vw; height: 80vh; background-color: grey; overflow-x: auto;" @drop="handleCardDrop($event, boardState.length ,0)" @dragover.prevent @dragenter="handleDragEnter($event)" @click="showPlayerHands = false">
          <div v-for="(column, index) in boardState" :key="`board_column_${index}`" class="self-center">
            <div class=" row items-start q-pa-md">
              <fola-card 
                v-for="(cardId, cardIndex) in column" 
                :key="cardId" 
                :allow-edit="true"
                :allow-copy-to-hand="true"
                :name="cards[cardId].name"
                :uuid="cards[cardId].uuid"
                :description="cards[cardId].description"
                :external-link="cards[cardId].externalLink"
                :image-url="cards[cardId].imageUrl"
                :type="cards[cardId].cardType"
                :interactionSubjectLeft="cards[cardId].interactionSubjectLeft"
                :interactionSubjectRight="cards[cardId].interactionSubjectRight"
                :interactionDirection="cards[cardId].interactionDirection"
                :addons-top="cards[cardId].addonsTop"
                :addons-bot="cards[cardId].addonsBot"
                mode="view"
                allow-drag="true"
                :allow-pick-up="true"
                @dragstart="handleDragStart($event, index, cardIndex)"
                @drop="handleAddonDrop($event, cardId)"
                @addon-removed="handleAddonRemove($event, cardId)"
                @card-edit-submitted="(editConfig) => emitUpdateCard({ config: editConfig })"
                @pick-up-card="handlePickUpInteraction($event, index, cardIndex)"
                @card-copy-submitted="handleCardCopy($event)"
              />
            </div>
        </div>
        </q-card>
      </div>
      <div v-else>
        No board
      </div>
    </div>
    <q-dialog seamless v-model="showPlayerHands" full-width position="bottom">
      <q-card>
        <player-card-container v-if="showPlayerHands" :selected-hand="selectedHand"/>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom">
      <q-icon color="primary" size="5em" name="pan_tool" @click="showPlayerHands = !showPlayerHands" />
    </q-page-sticky>

  </q-page>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { mapState, mapGetters, mapActions } from 'vuex'
import PlayerCardContainer from '@/components/PlayerCardContainer.vue'

export default {
  name: "BoardDetails",
  components: {
    PlayerCardContainer,
  },
  data() {
    return {
      messageInput: '',
      showPlayerHands: false,
      selectedHand: this.uuid
  }},
  computed: {
    ...mapState('auth', ['accessToken']),
    canCreateBoards () {
      return this.userHasPermission()('API:BOARD:CREATE')
    },
    inviteUrl () {
      return `${window.location.origin}/boards/${this.boardId}?inv=${this.inviteCode}`
    },
    ...mapState('player', ['permissions', 'uuid']),
    ...mapState('activeBoard', ['name', 'description', 'inviteCode', 'boardState', 'cards']),
    ...mapState('activeBoard', {
      boardId: state => state.uuid
    }),
    ...mapState('player', ['uuid'])
  },
  async created () {
    if(this.$route.query.inv){
        await this.joinBoardByInvite({uuid: this.$route.params.id, inviteCode: this.$route.query.inv})
    }
    await this.loadOwnProfile()
    await this.loadOwnPermissions()
    this.connectSocket({token: this.accessToken})
    this.emitJoinBoard({boardId: this.$route.params.id})
    this.$matomo && this.$matomo.trackPageView()
  },
  beforeUnmount(){
    this.disconnectSocket()
    this.resetBoard()
  },
  watch:{
    $route (to, from){
    this.disconnectSocket()
    this.resetBoard()
    }
  }, 
  methods: {
    ...mapGetters('player', ['userHasPermission']),
    ...mapActions('player', ['loadOwnPermissions']),
    ...mapActions('player', ['loadOwnProfile']),
    ...mapActions('activeBoard', ['connectSocket', 'joinBoardByInvite', 'emitMessage', 'emitPlayInteraction', 'emitPickUpInteraction', 'emitAttachCard', 'emitDetachCard', 'emitRemoveCard', 'emitUpdateCard', 'emitAddCard', 'emitJoinBoard', 'emitLeaveBoard', 'resetBoard', 'getCardAtPosition', 'disconnectSocket', 'emitCreateCard']),
    ...mapActions('alert', ['setAlert']),
    async copyInviteLink () {
      await copyToClipboard(this.inviteUrl)
      this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('boards.link_copied'),
      })
    },
    async sendMessage () {
      try {
        await this.emitMessage({"message": this.messageInput})
        this.messageInput = ''
      } catch (err) {
        console.error(err)
        this.setAlert({
          type: 'negative',
          visible: true,
          message: "error sending message",
        })
      }
    },
    handleHandContainerSwipe (e){
      if(e.direction === "down"){
        this.showPlayerHands = false
      }
    },
    handleBoardDragOver (e) {
    
    },
    handleDragStart: function (event, column, index) {
      const origin = {
        column: column,
        index: index,
        container: "board"
      }
      const originString = JSON.stringify(origin)
      event.dataTransfer.setData('cardOrigin', originString)
    },
    handleDragEnter (e) {
      this.showPlayerHands = false
    },
    handleCardDrop (e, column, index) {
      const cardId = e.dataTransfer.getData('cardId')
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      if(this.cards[cardId].cardType === "interaction" && origin.container === 'hand'){
        this.emitPlayInteraction({cardId: cardId, origin: origin, column: column, index: index})
      }
    },
    async handleAddonDrop (e, targetId) {
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      if(origin.container === 'board'){
        return
      }
      const cardId = e.dataTransfer.getData('cardId')
      this.emitAttachCard({cardOrigin: origin, cardId: cardId, target: targetId})
    },
    handleAddonRemove(event, column, index) {
      this.emitDetachCard({addonId: event.addonId, hostCardId: event.hostCardId})
      this.showPlayerHands = true
      this.selectedHand = this.uuid
    },
    handlePickUpInteraction(event, column, index){
      const cardId = event.cardId
      this.emitPickUpInteraction({cardId: cardId, column: column})
    },
    handleCardCopy (e) {
      //remove any addons that may be attached before creating copy
      delete e.addonsTop
      delete e.addonsBot
      this.emitCreateCard({"card": e})
      this.showPlayerHands = true
    },
  },

};
</script>
<style scoped>
.board-thumbnail {
height: auto;
width: 200px;
}
.card-dropzone {
  background-color:#2196F3;
  width: 200px;
  max-width: 50vw;
  height: 200px;
  max-height: 40vh;
}
.btn-pick-card {
  position: absolute;
  top: 2vw;
  right: 2vh;
}

.player-card-container {
  position: fixed;
  bottom: 10vh;
  left: 5vw;
  max-width: 90vw;
}
</style>
