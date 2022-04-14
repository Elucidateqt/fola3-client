<template>
  <q-card v-if="currentDeck === null" class="q-pa-sm">
    <q-card-section class="text-center text-h3">
      Decks
    </q-card-section>
    <q-card-section class="q-gutter-md scroll" style="max-height: 80vh">
      <div v-if="ownDecks.length === 0" class="text-center">
        {{$t('deck.no_decks')}}
      </div>
      <fola-deck v-for="(deck, index) in ownDecks" :key="deck.uuid" :deck="deck" mode="view" @deck-selected="setCurrentDeck(index)"  />
    </q-card-section>
    <q-card-actions align="around">
      <q-btn @click="createTemplateDeck" color="primary" :label="$t('deck.new_deck')" />
    </q-card-actions>
  </q-card>
  <fola-deck v-else :deck="currentDeck" mode="edit" />


</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import FolaDeck from '@/components/FolaDeck.vue'

export default {
  name: "DeckManager",
  components: {
    FolaDeck
  },
  data: () => ({
    cardCreatorVisible: false,
    deckManagerVisible: true,
    selectedDeck: null
  }),
  watch: {
    selectedSets(newSelection, oldSelection) {
      console.log("selectedSets changed")
      this.resetCards()
      //this.loadCards({'setIds': newSelection})
    }
  },
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('cards', ['cards']),
    ...mapState('cardsets', ['ownSets']),
    ...mapGetters('cardsets', ['getCheckboxOptions']),
    ...mapState('decks', ['ownDecks', 'currentDeck']),
    deckManagerWidth () {
      return Math.min(Number(screen.availWidth/3), 300)
    }
  },
  async created () {
    await this.loadOwnDecks()
  },
  beforeUnmount(){
    this.resetDecks()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('cardsets', ['loadOwnCardSets', 'loadPublicCardSets', 'loadWIPCardSets']),
    ...mapActions('cards', ['loadCards', 'resetCards', 'createCard', 'deleteCard', 'updateCard']),
    ...mapActions('decks', ['loadOwnDecks', 'createOwnDeck', 'setCurrentDeck', 'resetDecks']),
    loadMoreCards (index, done) {
      console.log("loading cards", this.selectedSets.length)
      if(this.selectedSets.length > 0){
        this.loadCards({"setIds": this.selectedSets})
      }
      done()
    },
    handleCardCreation(card){

      this.createCard({card: {
        "name": card.name,
        "description": card.description,
        "knowledbaseUrl": card.knowledbaseUrl,
        "imageUrl": card.imageUrl,
        "type": card.cardType,
        "interactionSubjectLeft": card.interactionSubjectLeft,
        "interactionSubjectRight": card.interactionSubjectRight,
        "interactionDirection": card.interactionDirection
      }})
      this.selectedSets = [this.ownSets[0].uuid]
    },
    handleCardUpdate(data) {
      this.updateCard({
        "uuid": data.uuid,
        "name": data.name,
        "description": data.description,
        "knowledbaseUrl": data.knowledbaseUrl,
        "imageUrl": data.imageUrl,
        "type": data.cardType,
        "interactionSubjectLeft": data.interactionSubjectLeft,
        "interactionSubjectRight": data.interactionSubjectRight,
        "interactionDirection": data.interactionDirection
      })
    },
    handleCardDeletion(data){
      this.deleteCard({"uuid": data})
    },
    async createTemplateDeck(){
      const deckTemplate = {
        "name": this.$t('deck.new_deck'),
        "cards": [],
        "public": false
      }
      await this.createOwnDeck(deckTemplate)
      await this.setCurrentDeck(0)

    }
  },

};
</script>
<style scoped>
.report-form {
  width: 700px;
  max-width: 80vw;
}
</style>
