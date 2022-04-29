<template>
<q-page padding class="row justify-center">
  <div class="col-xs-8 collection-container" @dragover.prevent @drop="handleCardDrop">
    <q-form class="row">
          <q-option-group
      v-model="selectedSets"
      @update:model-value="handleSetSelection"
      :options="getCheckboxOptions"
      color="primary"
      type="checkbox"
      inline
    />
    <q-icon v-if="canManageSets" name="settings" size="sm" class="grey q-pl-md" @click="cardsetManagerVisible = true" style="cursor: pointer" />
    </q-form>


  <q-infinite-scroll @load="loadMoreCards" class="row q-gutter-xl">
    <fola-card v-for="cardId in filteredCards" :key="cardId" :class="['col-xs-12', 'col-sm-4', 'col-md-4', 'col-lg-2', {'faded': isCardInCurrentDeck(cardId)}]"
    :data-card-id="cardId"
    :cardset="cards[cardId].cardset"
    :allow-set-change="canChangeCardsetOfCard"
    :allow-delete="canDeleteCard(cards[cardId])"
    :allow-edit="canEditCard(cards[cardId])"
    :allow-drag="isCardInCurrentDeck(cardId) === false ? true : false"
    :name="cards[cardId].name"
    :uuid="cards[cardId].uuid"
    :description="cards[cardId].description"
    :external-link="cards[cardId].externalLink"
    :image-url="cards[cardId].imageUrl"
    :type="cards[cardId].cardType"
    :interactionSubjectLeft="cards[cardId].interactionSubjectLeft"
    :interactionSubjectRight="cards[cardId].interactionSubjectRight"
    :interactionDirection="cards[cardId].interactionDirection"
    mode="view"
    :setOptions="getCheckboxOptions"
    @set-changed="handleSetChange($event, cards[cardId])"
    @card-deleted="handleCardDeletion($event)"
    @card-edit-submitted="handleCardUpdate($event)"
    @dragstart="handleDragStart($event, cardId)"
    />
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
    round
    color="accent"
    :aria-label="$t('base.create')"
    icon="add"
    @click="cardCreatorVisible = true"
  />
  </q-page-sticky>
  </div>



     <q-drawer
        v-model="deckManagerVisible"
        side="right"
        behavior="desktop"
        :width="deckManagerWidth"
        elevated
        bordered
      >
        <deck-manager />
      </q-drawer>
        
        <q-page-sticky position="right">
      <q-btn
    round
    color="accent"
    :aria-label="deckManagerVisible === true ? $t('deck.hide_deckmanager') : $t('deck.show_deckmanager')"
    :icon="deckManagerVisible === true ? 'arrow_forward_ios' : 'arrow_back_ios'"
    @click="deckManagerVisible = !deckManagerVisible"
  />
  </q-page-sticky>


  <fola-card v-if="cardCreatorVisible" v-show="false"
                class="card-creator"
                name="new cardname"
                description="new Description"
                type="LET"
                interactionSubjectLeft="teacher"
                interactionSubjectRight="student"
                interactionDirection="rightToLeft"
                mode="create" allow-drag="false" @card-create-submitted="handleCardCreation($event)" @editor-closed="cardCreatorVisible = false" />
  <q-dialog v-model="cardsetManagerVisible">
    <cardset-manager />
  </q-dialog>
</q-page>
</template>

<script>
import { scroll } from 'quasar'
const { getScrollTarget, setVerticalScrollPosition } = scroll
import { mapState, mapGetters, mapActions } from 'vuex'
import FolaCard from '@/components/FolaCard.vue'
import DeckManager from '@/components/DeckManager.vue'
import CardsetManager from '@/components/CardsetManager.vue'

export default {
  name: "Collection",
  emits: ['dragstart'],
  components: {
    FolaCard,
    DeckManager,
    CardsetManager
  },
  data: () => ({
    cardCreatorVisible: false,
    deckManagerVisible: true,
    cardsetManagerVisible: false,
    selectedSets: []
  }),
  computed: {
    filteredCards () {
      let whitelist = []
      if(this.currentDeck){
        whitelist.concat(this.currentDeck.cards)
      }
      Object.values(this.cards).forEach(card => {
        if(this.selectedSets.includes(card.cardset)){
          whitelist.push(card.uuid)
        }
      })
      return whitelist
    },
    canCreateCards () {
      return this.userHasPermission()('API:CARDS:CREATE')
    },
    canChangeCardsetOfCard () {
      return this.userHasPermission()('API:CARDS:MANAGE')
    },
    canManageSets () {
      return this.userHasPermission()('API:CARDSETS:MANAGE')
    },
    ...mapState('player', ['permissions']),
    ...mapState('cards', ['cards']),
    ...mapGetters('cardsets', ['getCheckboxOptions', 'getBearerSets']),
    ...mapState('cardsets', ['cardsets']),
    ...mapState('decks', ['ownDecks', 'currentDeck']),
    ...mapState('player', ['uuid']),
    ...mapGetters('decks', ['isCardInCurrentDeck']),
    deckManagerWidth () {
      return Math.min(Number(screen.availWidth/3), 300)
    }
  },
  async created () {
    await this.loadOwnPermissions()
    await this.loadOwnCardSets()
    await this.loadPublicCardSets()
    if(this.userHasPermission()("API:CARDSETS:MANAGE")){
      await this.loadWIPCardSets()
    }
    this.selectedSets[0] = this.getCheckboxOptions[0].value
  },
  beforeUnmount(){
    this.resetCardSets()
    this.resetCards()
    this.resetDecks()
  },
  methods: {
    ...mapGetters('player', ['userHasPermission']),
    ...mapActions('player', ['loadOwnPermissions']),
    ...mapActions('cardsets', ['loadOwnCardSets', 'loadPublicCardSets', 'loadWIPCardSets', 'getSetWithCard', 'resetCardSets']),
    ...mapActions('cards', ['loadCards', 'resetCards', 'createCard', 'deleteCard', 'updateCard']),
    ...mapActions('decks', ['loadOwnDecks', 'removeCardFromCurrentDeck', 'resetDecks']),
    loadMoreCards (index, done) {
      if(this.selectedSets.length > 0){
        this.loadCards({"setIds": this.selectedSets})
      }
      done()
    },
    async handleCardCreation(card){
      const el = document.querySelector(".collection-container")
      
      this.scrollToElement(el)
      await this.createCard({card: {
        "name": card.name,
        "description": card.description,
        "externalLink": card.externalLink,
        "imageUrl": card.imageUrl,
        "type": card.cardType,
        "interactionSubjectLeft": card.interactionSubjectLeft,
        "interactionSubjectRight": card.interactionSubjectRight,
        "interactionDirection": card.interactionDirection
      }})
    },
    async handleSetChange(event, card) {
        await this.updateCard({
        "uuid": card.uuid,
        "cardset": event.newSet
      })
    },
    handleSetSelection(selection) {
      this.resetCards({keepDeckCards: true})
      if(selection.length > 0){
        this.loadCards({"setIds": selection})
      }
    },
    handleCardUpdate(data) {
      this.updateCard({
        "uuid": data.uuid,
        "name": data.name,
        "description": data.description,
        "externalLink": data.externalUrl,
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
    handleDragStart: function (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('origin', JSON.stringify({
        owner: this.uuid,
        container: "collection"
      }))
      this.$emit("dragstart", event)
    },
    handleCardDrop(e){
      const origin = JSON.parse(e.dataTransfer.getData('origin'))
      if(origin.container !== 'deck'){
        return
      }
      const cardId = JSON.parse(e.dataTransfer.getData('cardId'))
      this.removeCardFromCurrentDeck(cardId)
    },
    scrollToElement (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 300
      setVerticalScrollPosition(target, offset, duration)
    },
    canDeleteCard (card) {
      return this.getBearerSets.some(set => set.uuid === card.cardset) || this.userHasPermission()('API:CARDS:MANAGE')
    },
    canEditCard (card) {
      return this.getBearerSets.some(set => set.uuid === card.cardset) || this.userHasPermission()('API:CARDS:MANAGE')
    },
  },

};
</script>
<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
.faded {
  opacity: 0.4;
}
</style>
