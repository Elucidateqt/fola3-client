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
          <div v-for="(column, index) in boardState" :key="`board_comumn_${index}`" class="col self-center">
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
        <player-card-container :players="players" v-if="showPlayerHands" class="player-card-container" />
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
      boardState: [],
      players: [
        {
          uuid: "a6173138-3c4e-4d00-949d-759416a9fe94",
          username: "apitest",
          cards: [{
            uuid: "e6c69ea8-ffe1-49ed-8e1a-c6cbaf7cfea0",
            name: "Greeting",
            description: "The teacher greets the students in Zoom",
            cardType: "interaction",
            interactionSubjectLeft: "teacher",
            interactionSubjectRight: "student",
            interactionDirection: "both",
            imageUrl: "https://loremflickr.com/320/240",
            knowledbaseUrl: "https://knowhow.studiumdigitale.uni-frankfurt.de/",
            LTEsensors: [],
            requiredSensors: [],
            createdAt: "2022-03-10T14:14:19.733Z",
            updatedAt: "2022-03-10T14:14:19.733Z",
            },
            {
            uuid: "e6c69ea8-ffe1-49ed-8e1a-c6cbaf7cfea0",
            name: "Moodle",
            description: "The moodle instance of studiumdigitale",
            cardType: "LET",
            interactionSubjectLeft: "teacher",
            interactionSubjectRight: "student",
            interactionDirection: "both",
            imageUrl: "https://loremflickr.com/320/240",
            knowledbaseUrl: "https://knowhow.studiumdigitale.uni-frankfurt.de/",
            LTEsensors: [],
            requiredSensors: [],
            createdAt: "2022-03-10T14:14:19.733Z",
            updatedAt: "2022-03-10T14:14:19.733Z",
            },
            {
            uuid: "e6c69ea8-ffe1-49ed-8e1a-c6cbaf7cfea0",
            name: "Initiative",
            description: "Students regularly participate in discussions",
            cardType: "what",
            interactionSubjectLeft: "teacher",
            interactionSubjectRight: "student",
            interactionDirection: "both",
            imageUrl: "https://loremflickr.com/320/240",
            knowledbaseUrl: "https://knowhow.studiumdigitale.uni-frankfurt.de/",
            LTEsensors: [],
            requiredSensors: [],
            createdAt: "2022-03-10T14:14:19.733Z",
            updatedAt: "2022-03-10T14:14:19.733Z",
            }
          ]
        },
                {
          uuid: "060f08c8-57b4-41e4-bbb5-44b1796ed820",
          username: "Root",
          cards: [{
            uuid: "e6c69ea8-ffe1-49ed-8e1a-c6cbaf7cfea0",
            name: "Greeting",
            description: "The teacher greets the students in Zoom",
            cardType: "interaction",
            interactionSubjectLeft: "teacher",
            interactionSubjectRight: "student",
            interactionDirection: "both",
            imageUrl: "https://loremflickr.com/320/240",
            knowledbaseUrl: "https://knowhow.studiumdigitale.uni-frankfurt.de/",
            LTEsensors: [],
            requiredSensors: [],
            createdAt: "2022-03-10T14:14:19.733Z",
            updatedAt: "2022-03-10T14:14:19.733Z",
            },
            {
            uuid: "e6c69ea8-ffe1-49ed-8e1a-c6cbaf7cfea0",
            name: "Moodle",
            description: "The moodle instance of studiumdigitale",
            cardType: "LET",
            interactionSubjectLeft: "teacher",
            interactionSubjectRight: "student",
            interactionDirection: "both",
            imageUrl: "https://loremflickr.com/320/240",
            knowledbaseUrl: "https://knowhow.studiumdigitale.uni-frankfurt.de/",
            LTEsensors: [],
            requiredSensors: [],
            createdAt: "2022-03-10T14:14:19.733Z",
            updatedAt: "2022-03-10T14:14:19.733Z",
            },
            {
            uuid: "e6c69ea8-ffe1-49ed-8e1a-c6cbaf7cfea0",
            name: "Initiative",
            description: "Students regularly participate in discussions",
            cardType: "what",
            interactionSubjectLeft: "teacher",
            interactionSubjectRight: "student",
            interactionDirection: "both",
            imageUrl: "https://loremflickr.com/320/240",
            knowledbaseUrl: "https://knowhow.studiumdigitale.uni-frankfurt.de/",
            LTEsensors: [],
            requiredSensors: [],
            createdAt: "2022-03-10T14:14:19.733Z",
            updatedAt: "2022-03-10T14:14:19.733Z",
            }
          ]
        }
    ]
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
    ...mapState('boards', ['activeBoard'])
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
    ...mapActions('boards', ['loadBoardDetails', 'joinBoardByInvite', 'emitMessage', 'emitPlayInteraction']),
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
      const card = {
        "uuid" : e.dataTransfer.getData('uuid'),
        "name":  e.dataTransfer.getData('name'),
        "description":  e.dataTransfer.getData('description'),
        "knowledbaseUrl":  e.dataTransfer.getData('knowledgebaseUrl'),
        "imageUrl":  e.dataTransfer.getData('imageUrl'),
        "cardType":  e.dataTransfer.getData('cardType'),
        "interactionSubjectLeft":  e.dataTransfer.getData('interactionSubjectLeft'),
        "interactionSubjectRight":  e.dataTransfer.getData('interactionSubjectRight'),
        "interactionDirection":  e.dataTransfer.getData('interactionDirection')
      }
      if(card.cardType === "interaction"){
        this.emitPlayInteraction(card)
        this.boardState.push([card])
      }
  console.log('data received', card)
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
