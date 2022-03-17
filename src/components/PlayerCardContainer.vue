<template>
  <div class="q-gutter-y-md">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab v-for="player in activeBoardPlayers" :key="`hand_tab_${player.uuid}`" :name="player.uuid" :label="player.username" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated swipeable>
        <q-tab-panel v-for="player in activeBoardPlayers" :key="`hand_panel_${player.uuid}`" :name="player.uuid" @drop.prevent="handleCardDrop">
          <q-scroll-area class="player-card-container">
            <div class="q-pa-md row items-start q-gutter-md">
              <fola-card 
                v-for="(card, index) in activeBoardHands[player.uuid]" 
                :key="card.uuid" 

                :name="card.name"
                :uuid="card.uuid"
                :description="card.description"
                :external-link="card.knowledbaseUrl"
                :image-url="card.imageUrl"
                :type="card.cardType"
                :interactionSubjectLeft="card.interactionSubjectLeft"
                :interactionSubjectRight="card.interactionSubjectRight"
                :interactionDirection="card.interactionDirection"
                :addons-top="card.addonsTop"
                :addons-bot="card.addonsBot"
                mode="view"
                allow-drag="true"
                @dragstart="handleDragStart($event, player.uuid)"
                @card-edit-submitted="(editConfig) => handleCardEdit($event, {player: player.uuid, index: index, card: editConfig})"
                @delete-card="handleCardDelete($event, player.uuid, index, card)"
              />
            </div>
          </q-scroll-area>
            <q-btn
              round
              color="accent"
              :aria-label="$t('base.create')"
              icon="add"
              class="btn-add-card"
              @click="cardCreatorVisible = true"
            />
            <fola-card v-if="cardCreatorVisible"
                name="new cardname"
                description="new Description"
                external-link="djaodjioawjiood"
                image-url="cardimage"
                type="LET"
                interactionSubjectLeft="teacher"
                interactionSubjectRight="student"
                interactionDirection="rightToLeft"
                :addons-top="dummyAddons" :mode="cardCreatorVisible === true ? 'create' : 'view'" allow-drag="false" @card-create-submitted="handleCardCreation($event, player.uuid)" class="card-creator" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
</div>
</template>

<script>
 import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import FolaCard from '@/components/FolaCard.vue'

export default defineComponent( {
  name: "PlayerCardContainer",

  components: {
      FolaCard
  },
  props: ['selectedHand'],
  data () {
      return {
          tab: this.selectedHand,
          activeDrag: null,
          cardCreatorVisible: false,
          dummyAddons: [
{ "uuid": "d58362bc-e87d-46ab-992c-bf79bc335db1", "name": "Moodle", "description": "The moodle instance of studiumdigitale", "cardType": "LET", "interactionSubjectLeft": "teacher", "interactionSubjectRight": "student", "interactionDirection": "both", "imageUrl": "https://loremflickr.com/320/240", "knowledbaseUrl": "https://knowhow.studiumdigitale.uni-frankfurt.de/", "LTEsensors": [], "requiredSensors": [], "createdAt": "2022-03-10T14:14:19.733Z", "updatedAt": "2022-03-10T14:14:19.733Z" }
          ]
      }
  },
  computed: {
    ...mapState('player', ['username', 'uuid']),
    ...mapState('boards', ['activeBoardPlayers', 'activeBoardHands'])
  },
  async created () {
      this.tab = this.uuid
  },
  methods: {
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('boards', ['emitRemoveCard', 'emitUpdateCard', 'emitAddCard']),
    handleDragStart: function (event, playerId) {
      const origin = {
        playerId: playerId,
        container: "hand"
      }
      const originString = JSON.stringify(origin)
      event.dataTransfer.setData('cardOrigin', originString)
    },
    handleCardEdit: function (event, data) {
      this.emitUpdateCard({card: data.card, location: {container: "hand", playerId: data.player, index: data.index} })
    },
    handleCardDrop (e, uuid) {
      const card = JSON.parse(e.dataTransfer.getData('card'))
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      this.activeDrag = null
      this.emitAddCard({card: card, target: {container: "hand", playerId: uuid}})
      this.emitRemoveCard({cardId: card.uuid, location: origin })
    },
    handleCardCreation (e, playerId) {
      this.emitAddCard({"card": e, location: {container: "hand", playerId: playerId}})
      this.cardCreatorVisible = false
    },
    //TODO: handle deletions using splice instead of filter and remove card
    handleCardDelete (e, playerId, cardIndex, card) {
      this.emitRemoveCard({cardId: card.uuid, location: {playerId: playerId, container: "hand", index: cardIndex}})
    }
  },

});
</script>
<style scoped>
.player-card-container {
  height: 40vh;
  max-height: 300px;
  width: 1800px;
  max-width: 95vw;
}
.btn-add-card {
  position: absolute;
  right: 2vw;
  bottom: 5vh;
}

.card-creator {
  position: absolute;
  top: 200vh;
}
</style>
