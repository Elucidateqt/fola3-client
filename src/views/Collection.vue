<template>
<q-page padding class="row justify-center">
  <div class="col-xs-8" @dragover.prevent @drop="handleCardDrop">
    <q-form class="row">
          <q-option-group
      v-model="selectedSets"
      @update:model-value="handleSetSelection"
      :options="getCheckboxOptions"
      color="primary"
      type="checkbox"
      inline
    />
    </q-form>


  <q-infinite-scroll @load="loadMoreCards" class="row q-gutter-xl">
    <fola-card v-for="card in cards" :key="card.uuid" :class="['col-xs-12', 'col-sm-4', 'col-md-4', 'col-lg-2', {'faded': isCardInCurrentDeck(card.uuid)}]"
    :data-card-id="card.uuid"
    :ref="`card-${card.uuid}`"
    :allow-drag="isCardInCurrentDeck(card.uuid) === false ? true : false"
    :name="card.name"
    :uuid="card.uuid"
    :description="card.description"
    :external-link="card.knowledbaseUrl"
    :image-url="card.imageUrl"
    :type="card.cardType"
    :interactionSubjectLeft="card.interactionSubjectLeft"
    :interactionSubjectRight="card.interactionSubjectRight"
    :interactionDirection="card.interactionDirection"
    mode="view"
    :setOptions="getCheckboxOptions"
    @set-changed="handleSetChange($event)"
    @card-deleted="handleCardDeletion($event)"
    @card-edit-submitted="handleCardUpdate($event)"
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
        show-if-above
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
    :aria-label="$t('base.create')"
    :icon="deckManagerVisible === true ? 'arrow_forward_ios' : 'arrow_back_ios'"
    @click="deckManagerVisible = !deckManagerVisible"
  />
  </q-page-sticky>


  <fola-card v-if="cardCreatorVisible" v-show="false"
                class="card-creator"
                name="new cardname"
                description="new Description"
                external-link="djaodjioawjiood"
                image-url="cardimage"
                type="LET"
                interactionSubjectLeft="teacher"
                interactionSubjectRight="student"
                interactionDirection="rightToLeft"
                mode="create" allow-drag="false" @card-create-submitted="handleCardCreation($event)" @editor-closed="cardCreatorVisible = false" />
</q-page>
</template>

<script>
import { scroll } from 'quasar'
const { getScrollTarget, setVerticalScrollPosition } = scroll
import { mapState, mapGetters, mapActions } from 'vuex'
import FolaCard from '@/components/FolaCard.vue'
import DeckManager from '@/components/DeckManager.vue'

export default {
  name: "Collection",
  components: {
    FolaCard,
    DeckManager,
  },
  data: () => ({
    cardCreatorVisible: false,
    deckManagerVisible: true,
    selectedSets: []
  }),
  /*watch: {
    selectedSets(newSelection, oldSelection) {
      this.resetCards()
    }
  },*/
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('cards', ['cards']),
    ...mapGetters('cardsets', ['getCheckboxOptions', 'getBearerSets']),
    ...mapState('decks', ['ownDecks']),
    ...mapGetters('decks', ['isCardInCurrentDeck']),
    deckManagerWidth () {
      return Math.min(Number(screen.availWidth/3), 300)
    }
  },
  async created () {
    await this.loadUserPermissions()
    await this.loadOwnCardSets()
    await this.loadPublicCardSets()
    if(this.userHasPermission("API:CARDSETS:MANAGE")){
      await this.loadWIPCardSets()
    }
    this.selectedSets[0] = this.getCheckboxOptions[0].value
  },
  beforeUnmount(){
    this.resetCardSets()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('cardsets', ['loadOwnCardSets', 'loadPublicCardSets', 'loadWIPCardSets', 'getSetWithCard', 'resetCardSets']),
    ...mapActions('cards', ['loadCards', 'resetCards', 'createCard', 'deleteCard', 'updateCard']),
    ...mapActions('decks', ['loadOwnDecks', 'removeCardFromCurrentDeck']),
    loadMoreCards (index, done) {
      if(this.selectedSets.length > 0){
        this.loadCards({"setIds": this.selectedSets})
      }
      done()
    },
    async handleCardCreation(card){

      await this.createCard({card: {
        "name": card.name,
        "description": card.description,
        "knowledbaseUrl": card.knowledbaseUrl,
        "imageUrl": card.imageUrl,
        "type": card.cardType,
        "interactionSubjectLeft": card.interactionSubjectLeft,
        "interactionSubjectRight": card.interactionSubjectRight,
        "interactionDirection": card.interactionDirection
      }})
      const el = document.querySelector(`[data-card-id="${this.cards[0].uuid}"`)
      console.log("scrolltarget", el)
      this.scrollToElement(el)
    },
      async handleSetChange(data) {
        console.log("set of card: ", await this.getSetWithCard(data))
    console.log("handlesetchange", data)
    },
    handleSetSelection(selection) {
      this.resetCards()
      if(selection.length > 0){
        this.loadCards({"setIds": selection})
      }
      console.log("value", selection)
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
    handleCardDrop(e){
      const card = JSON.parse(e.dataTransfer.getData('card'))
      this.removeCardFromCurrentDeck(card.uuid)
    },
    scrollToElement (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 300
      setVerticalScrollPosition(target, offset, duration)
}
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
