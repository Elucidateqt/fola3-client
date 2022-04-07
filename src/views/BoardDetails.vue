<template>
  <q-page>
    <div class="q-pa-md row items-start q-gutter-md">
      <div v-if="activeBoard !== null">
        <q-input v-model="messageInput" filled label="message" />
        <q-btn @click="sendMessage" flat :label="$t('base.submit')" :aria-label="$t('base.submit')" :disable="messageInput === ''" color="primary" />
        <q-btn v-if="canCopyToClipboard" flat :label="$t('boards.copy_link')" :aria-label="$t('boards.copy_link')" @click="copyInviteLink" color="primary" />
        <div class="text-center">Inv: {{activeBoard.inviteCode}}</div>
        <div style="height: 80vh; width: 90vw; background-color: grey;" class="row" @drop="handleCardDrop($event)" @dragover.prevent @dragenter="handleDragEnter($event)" @click="showPlayerHands = false">
          <div v-for="(column, index) in activeBoardState" :key="`board_column_${index}`" class="self-center">
            <div class=" row items-start q-pa-xl">
              <fola-card 
                v-for="(interactionCard, cardIndex) in column" 
                :key="interactionCard.uuid" 

                :name="interactionCard.name"
                :uuid="interactionCard.uuid"
                :description="interactionCard.description"
                :external-link="interactionCard.knowledbaseUrl"
                :image-url="interactionCard.imageUrl"
                :type="interactionCard.cardType"
                :interactionSubjectLeft="interactionCard.interactionSubjectLeft"
                :interactionSubjectRight="interactionCard.interactionSubjectRight"
                :interactionDirection="interactionCard.interactionDirection"
                :addons-top="interactionCard.addonsTop"
                :addons-bot="interactionCard.addonsBot"
                mode="view"
                allow-drag="true"
                :allow-pick-up="true"
                @dragstart="handleDragStart($event, index, cardIndex)"
                @drop="handleAddonDrop($event, index, cardIndex, interactionCard)"
                @addon-removed="handleAddonRemove($event, index, cardIndex)"
                @pick-up-card="handlePickUpInteraction($event, index, cardIndex)"
              />
            </div>
          </div>
          <div v-if="activeDrag != null" class="card-dropzone self-center" @drop="alert('hi')"></div>
        </div>
      </div>
      <div v-else>
        No board
      </div>
    </div>
    <q-page-sticky position="bottom" :offset="showPlayerHands === true ? [0,80] : [0, 20]">
      <q-avatar size="5em" @click="showPlayerHands = !showPlayerHands"> 
        <q-img src="@/assets/logo-transparent.svg" />
      </q-avatar>
    </q-page-sticky>
      <player-card-container v-if="showPlayerHands" :selected-hand="selectedHand" class="player-card-container"/>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import PlayerCardContainer from '@/components/PlayerCardContainer.vue'
import FolaCard from '@/components/FolaCard.vue'

export default {
  name: "BoardDetails",
  components: {
    PlayerCardContainer,
    FolaCard
  },
    data() {
    return {
      // counter only uses this.initialCounter as the initial value;
      // it is disconnected from future prop updates.
      messageInput: '',
      showPlayerHands: false,
      activeDrag: null,
      selectedHand: this.uuid
  }},
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    canCopyToClipboard () {
      return this.activeBoard.inviteCode && navigator.clipboard
    },
    inviteUrl () {
      return `${window.location.origin}/boards/${this.activeBoard.uuid}?inv=${this.activeBoard.inviteCode}`
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('boards', ['activeBoard', 'activeBoardState', 'activeAddonCards']),
    ...mapState('player', ['uuid'])
  },
  async created () {
    if(this.$route.query.inv){
        await this.joinBoardByInvite({uuid: this.$route.params.id, inviteCode: this.$route.query.inv})
    }
    await this.loadOwnProfile()
    await this.loadBoardDetails(this.$route.params.id)
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('player', ['loadOwnProfile', 'uuid']),
    ...mapActions('boards', ['loadBoardDetails', 'joinBoardByInvite', 'emitMessage', 'emitPlayInteraction', 'emitRemoveCard', 'emitUpdateCard', 'emitAddCard']),
    ...mapActions('alert', ['setAlert']),
    async copyInviteLink () {
      await navigator.clipboard.writeText(this.inviteUrl)
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
      this.activeDrag = JSON.parse(e.dataTransfer.getData('card'))
      const originString = JSON.stringify(origin)
      event.dataTransfer.setData('cardOrigin', originString)
    },
    handleDragEnter (e) {
      this.showPlayerHands = false
    },
    handleCardDrop (e) {
      const card = JSON.parse(e.dataTransfer.getData('card'))
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      if(card.cardType === "interaction"){
        this.emitPlayInteraction(card)
        this.emitRemoveCard({cardId: card.uuid, location: origin })
      }
      this.activeDrag = null
    },
    handleAddonDrop (e, column, index, interaction) {
      const card = JSON.parse(e.dataTransfer.getData('card'))
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      switch (card.cardType) {
        case 'LET':
          interaction.addonsTop.push(card) 
          break;
        case 'what':
          interaction.addonsBot.push(card)
        default:
          return
      }
      this.emitUpdateCard({card: interaction, location: {container: "board", "column": column, "index": index}})
      this.emitRemoveCard({cardId: card.uuid, location: origin })
    },
    handleAddonRemove(event, column, index) {
      this.emitUpdateCard({card: event.newConfig, location: {container: "board", "column": column, "index": index}})
      this.emitAddCard({card: event.addon, location: {container: "hand", playerId: this.uuid}})
      this.showPlayerHands = true
      this.selectedHand = this.uuid
    },
    handlePickUpInteraction(event, column, index){
      //TODO: fix duplicate addition of what-cards to player hands
      const interaction = event.card
      interaction.addonsTop.forEach(card => this.emitAddCard({card: card, location: {container: "hand", playerId: this.uuid}}))
      interaction.addonsBot.forEach(card => this.emitAddCard({card: card, location: {container: "hand", playerId: this.uuid}}))
      interaction.addonsTop = []
      interaction.addonsBot = []
      this.emitAddCard({card: interaction, location: {container: "hand", playerId: this.uuid}})
      this.emitRemoveCard({cardId: interaction.uuid, location: {container: "board", column: column, index: index} })
      this.showPlayerHands = true
      this.selectedHand = this.uuid
    }
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
