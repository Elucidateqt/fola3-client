<template>
  <q-page>
    <div class="q-pa-md row items-start q-gutter-md">
      <div v-if="activeBoard !== null">
        name: {{activeBoard.name}}
        code: {{activeBoard.inviteCode}}
        {{activeBoard}}
        
        <q-input v-model="messageInput" filled label="message" />
        <q-btn @click="sendMessage" flat :label="$t('base.submit')" :aria-label="$t('base.submit')" :disable="messageInput === ''" color="primary" />
        <q-btn v-if="canCopyToClipboard" flat :label="$t('boards.copy_link')" :aria-label="$t('boards.copy_link')" @click="copyInviteLink" color="primary" />
        <div style="height: 80vh; width: 90vw; background-color: grey;" class="row" @drop="handleCardDrop($event)" @dragover.prevent @dragenter.prevent>
          <div class="text-white">{{activeBoardState}}</div>
          <div v-for="(column, index) in activeBoardState" :key="`board_comumn_${index}`" class="col self-center">
            <div class="q-pa-md row items-start q-gutter-md">
              <fola-card 
                v-for="interactionCard in column" 
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
                mode="view"
                allow-drag="false"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No board
      </div>
    </div>
    <q-page-sticky position="bottom" :offset="[0, 20]">
      <q-avatar size="5em" @click="showPlayerHands = !showPlayerHands"> 
        <q-img src="@/assets/logo-transparent.svg" />
      </q-avatar>
      <div class="row">
        <q-slide-transition>
          <player-card-container v-if="showPlayerHands" class="player-card-container" />
        </q-slide-transition>
      </div>
    </q-page-sticky>
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
    ...mapState('boards', ['activeBoard', 'activeBoardState'])
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
    ...mapActions('player', ['loadOwnProfile']),
    ...mapActions('boards', ['loadBoardDetails', 'joinBoardByInvite', 'emitMessage', 'emitPlayInteraction', 'emitRemoveCard']),
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
    handleCardDrop (e) {
      const card = JSON.parse(e.dataTransfer.getData('card'))
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      this.activeDrag = card
      if(card.cardType === "interaction"){
        this.emitPlayInteraction(card)
        this.emitRemoveCard({cardId: card.uuid, location: origin })
      }
    }
  },

};
</script>
<style scoped>
.board-thumbnail {
height: auto;
width: 200px;
}
</style>
