<template>
  <div class="q-gutter-y-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab v-for="player in onlinePlayers" :key="`hand_tab_${player.uuid}`" :name="player.uuid" :label="player.username" />
      </q-tabs>

      <q-separator />

    <q-tab-panels v-model="tab" animated swipeable>
      <q-tab-panel v-for="player in onlinePlayers" :key="`hand_panel_${player.uuid}`" :name="player.uuid" @drop.prevent="handleCardDrop">
        <q-scroll-area class="player-card-container">
          <div class="q-pa-md row items-start q-gutter-md">
            <fola-card 
              v-for="(cardId) in playerHands[player.uuid]" 
              :key="cardId"
              allow-edit="true"
              allow-delete="true"
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
              @dragstart="handleDragStart($event, player.uuid)"
              @card-edit-submitted="(editConfig) => emitUpdateCard({ config: editConfig })"
              @card-deleted="handleCardDelete($event, player.uuid)"
            />
          </div>
        </q-scroll-area>


                <q-fab color="accent" icon="add" direction="up" class="btn-add-card">
        <q-fab-action color="secondary" @click="cardCreatorVisible = true" icon="library_add" :aria-label="$t('card.create_card')" :label="$t('card.create_card')" />
        <q-fab-action color="primary" @click="deckImporterVisible = true" icon="unarchive" :aria-label="$t('deck.import_deck')" :label="$t('deck.import_deck')" />
      </q-fab>
            <fola-card v-if="cardCreatorVisible"
                name="new cardname"
                description="new Description"
                type="LET"
                interactionSubjectLeft="teacher"
                interactionSubjectRight="student"
                interactionDirection="rightToLeft"
                :mode="cardCreatorVisible === true ? 'create' : 'view'" allow-drag="false" @card-create-submitted="handleCardCreation($event, player.uuid)" class="card-creator" />
        </q-tab-panel>
      </q-tab-panels>
    <q-dialog v-model="deckImporterVisible">
        <q-card  class="q-pa-sm deck-importer">
    <q-card-section class="text-center">
      {{$t('deck.ask_selection')}}:
    </q-card-section>
    <q-separator />
    <q-card-section class="q-gutter-md scroll row" style="max-height: 80vh">
      <div v-if="ownDecks.length === 0" class="text-center">
        {{$t('deck.no_decks')}}
      </div>
      <q-separator />
      <fola-deck v-for="(deck, index) in ownDecks" :key="deck.uuid" :deck="deck" mode="view" @deck-selected="setCurrentDeck(index)"
      :class="['col-xs-12', 'col-sm-4', 'col-md-4', 'col-lg-2', {'selected': isSelectedDeck(deck.uuid)}]"  />
    </q-card-section>
    <q-separator />
    <q-card-actions align="around">
      <q-btn @click="importSelectedDeck" :disable="!currentDeck" color="primary" :label="$t('deck.import_deck')" :aria-label="$t('deck.import_deck')" />
      <q-btn :label="$t('base.cancel')" :aria-label="$t('base.cancel')" @click="deckImporterVisible = false; resetCurrentDeck();" />
    </q-card-actions>
        </q-card>
    </q-dialog>
</div>
</template>

<script>
 import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import FolaDeck from '@/components/FolaDeck.vue'

export default defineComponent( {
  name: "PlayerCardContainer",

  components: {
      FolaDeck
  },
  props: ['selectedHand'],
  data () {
      return {
          tab: this.selectedHand,
          activeDrag: null,
          cardCreatorVisible: false,
          deckImporterVisible: false,
      }
  },
  computed: {
    ...mapState('player', ['username', 'uuid']),
    ...mapState('activeBoard', ['players', 'playerHands', 'cards']),
    ...mapGetters('activeBoard', ['onlinePlayers']),
    ...mapState('decks', ['ownDecks', 'currentDeck']),
    ...mapGetters('decks', ['isSelectedDeck'])
  },
  async created () {
    try {
      await this.loadOwnDecks()
      this.tab = this.uuid
    } catch (err) {
      
    }
  },
  beforeUnmount(){
    this.resetDecks()
  },
  methods: {
    ...mapActions('player', ['loadOwnPermissions']),
    ...mapActions('activeBoard', ['emitUpdateCard', 'emitAddCard', 'emitDeleteCard', 'emitImportCurrentDeck', 'emitCreateCard']),
    ...mapActions('decks', ['loadOwnDecks', 'setCurrentDeck', 'resetCurrentDeck', 'resetDecks']),
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
      const cardId = e.dataTransfer.getData('cardId')
      const origin = JSON.parse(e.dataTransfer.getData('cardOrigin'))
      this.activeDrag = null
      this.emitAddCard({cardId: cardId, target: {container: "hand", playerId: uuid}})
      this.emitRemoveCard({cardId: card.uuid, location: origin })
    },
    handleCardCreation (e, playerId) {
      this.emitCreateCard({"card": e})
      this.cardCreatorVisible = false
    },
    importSelectedDeck () {
      this.emitImportCurrentDeck()
      this.deckImporterVisible = false
    },
    handleCardDelete (cardId, playerId) {
      this.emitDeleteCard({cardId: cardId, location: {playerId: playerId, container: "hand"}})
    },
  },

});
</script>
<style scoped>
.player-card-container {
  height: 40vh;
  max-height: 300px;
  width: 90vw;
  max-width: 95vw;
}
.deck-importer {
  width: 700px;
  max-width: 80vw;
}
.selected {
  border: solid;
  background-color: teal;
}
.btn-add-card {
  position: absolute;
  right: 4vw;
  bottom: 5vh;
}

.card-creator {
  position: absolute;
  top: 200vh;
}
</style>
