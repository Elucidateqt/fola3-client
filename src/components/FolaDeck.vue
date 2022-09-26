<template>
  <q-card
    v-if="mode === 'view'"
    :class="['q-pa-md', 'deck-view', {'selected': isSelectedDeck(deck.uuid)}]"
    @click="$emit('deck-selected')"
  >
    <q-card-section class="text-center">
      {{ deck.name }}
    </q-card-section>
  </q-card>
  <q-card
    v-if="mode === 'edit'"
    class="q-pa-md"
    @dragover.prevent
    @drop.prevent="handleCardDrop($event)"
  >
    <q-form @submit.prevent="handleFormSubmit">
      <q-card-section>
        <q-input
          v-model="deckName"
          filled
          label=""
          :rules="nameRules"
          @update:model-value="handleNameUpdate($event)"
        />
        <span class="text-start text-subtitle2">
          {{ $t('validation.curr_length', {"curr": deckName.length, "max": nameMax}) }}
        </span>
      </q-card-section>

      <q-separator />

      <q-card-section
        class="scroll"
        style="max-height: 78vh"
      >
        <div
          v-if="currentDeck.cards.length === 0"
          class="text-center"
        >
          {{ $t('card.no_cards') }}
        </div>
        <div
          v-else
          class="row"
        >
          <q-chip
            v-for="cardId in currentDeck.cards"
            :key="cardId"
            square
            draggable="true"
            text-color="white"
            :color="getTypeColor(cards[cardId].cardType)"
            class="col-12"
            :icon="getTypeIconName(cards[cardId].cardType)"
            @dragstart="handleDragStart($event, cardId)"
          >
            {{ cards[cardId].name }}
          </q-chip>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="around">
        <q-btn
          flat
          :label="$t('base.save')"
          :aria-label="$t('base.save')"
          :disable="!canSave"
          color="primary"
          type="submit"
        />
        <q-btn
          flat
          color="red"
          :label="$t('deck.delete')"
          @click="deleteDialogVisible = true"
        />
      </q-card-actions>
    </q-form>
  </q-card>
  <q-dialog
    v-model="deleteDialogVisible"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6">{{ $t('deck.delete_deck_confirm', {deckname: deckName}) }}</span>
      </q-card-section>

      <q-card-actions align="around">
        <q-btn
          v-close-popup
          flat
          :label="$t('base.cancel')"
          color="primary"
        />
        <q-btn
          v-close-popup
          flat
          :label="$t('base.delete')"
          color="primary"
          @click="deleteCurrentDeck"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "FolaDeck",

  components: {
    
  },
  props: {
    'deck': {
      type: Object,
      default: null
    }, 
    'mode': {
      type: String,
      default: 'view'
    }
  },
  emits: ['deck-selected', 'dragstart'],
  data (){
    return{
      deleteDialogVisible: false,
      cardList: this.deck && this.deck.cards ? this.deck.cards : [],
      deckName: this.deck && this.deck.name ? this.deck.name : '',
      nameMin: 3,
      nameMax: 128
    }
  },
  computed: {
    ...mapGetters('decks', ['isSelectedDeck']),
    ...mapState('decks', ['currentDeck']),
    ...mapState('cards', ['cards']),
    nameRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.nameMin) || this.$i18n.t('validation.min_length', {"min": this.nameMin}),
      val => (val.length <= this.nameMax) || this.$i18n.t('validation.max_length', {"max": this.nameMax}),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    canSave: function () {
      return this.nameMin <= this.deckName.length && this.deckName.length <= this.nameMax
      && !this.containsSpecialCharacters(this.deckName)
    }
  },
  methods: {
    ...mapActions('alert', ['setAlert']),
    ...mapActions('decks', ['addCardToCurrentDeck', 'removeCardFromCurrentDeck', 'saveCurrentDeck', 'setCurrentDeckName', 'deleteCurrentDeck']),
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
    },
    getTypeIconName (type) {
      switch (type) {
        case 'interaction':
          return 'offline_bolt'
        case 'LET':
          return 'memory'
        case 'what':
          return 'help'
        default:
          return 'style'
      }
    },
    getTypeColor (type) {
      switch (type) {
        case 'interaction':
          return 'primary'
        case 'LET':
          return 'accent'
        case 'what':
          return 'orange'
        default:
          return 'black'
      }
    },
    handleCardDrop (e) {
      const cardId = e.dataTransfer.getData('cardId')
      if(!this.currentDeck.cards.includes(cardId)){
        this.addCardToCurrentDeck(cardId)
      }
    },
    async handleFormSubmit() {
      if(!this.canSave){
        return
      }
      try {
        await this.saveCurrentDeck()
      } catch (err) {
        console.error('Error submitting bugreport: ', err)
        
      }
    },
    handleDragStart: function (event, cardId) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('cardId', JSON.stringify(cardId))
      event.dataTransfer.setData('origin', JSON.stringify({
        deckId: this.deck.uuid,
        container: "deck"
      }))
      this.$emit("dragstart", event)
    },
    handleNameUpdate: function (newVal) {
      this.setCurrentDeckName(newVal)
    }
  },

};
</script>
<style scoped>
.deck-view {
  cursor: pointer;
}

.selected {
  background-color: rgb(2, 123, 227);
  color: white;
}
</style>
