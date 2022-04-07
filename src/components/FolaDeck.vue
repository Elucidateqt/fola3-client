<template>
<q-card v-if="mode === 'view'" class="q-pa-md deck-view" @click="$emit('deck-selected')">
<q-card-section class="text-center">
  {{deck.name}}
</q-card-section>
</q-card>
    <q-card v-if="mode === 'edit'" class="q-pa-md"  @dragover.prevent @drop.prevent="handleCardDrop($event)">
      <q-form @submit.prevent="handleFormSubmit">
        <q-card-section>
        <q-input v-model="deckName" @update:model-value="handleNameUpdate($event)" filled label="" :rules="nameRules" />
        <span class="text-start text-subtitle2">
         {{$t('validation.curr_length', {"curr": deckName.length, "max": nameMax})}}
        </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll" style="max-height: 78vh">
          <div class="text-center" v-if="cardList.length === 0">
            {{$t('card.no_cards')}}
          </div>
          <div class="row">
            <q-chip square v-for="card in cardList" :key="card.uuid" draggable="true" @dragstart="handleDragStart($event, card)" text-color="white" :color="getTypeColor(card.cardType)" class="col-12" :icon="getTypeIconName(card.cardType)">{{card.name}}</q-chip>
            </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn flat :label="$t('base.save')" :aria-label="$t('base.save')" :disable="!canSave" color="primary" type="submit" />
          <q-btn flat @click="deleteCurrentDeck" color="red" :label="$t('deck.delete')" />
        </q-card-actions>
      </q-form>
    </q-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "FolaDeck",

  components: {
    
  },
  props: ['deck', 'mode'],
  emits: ['deck-selected', 'dragstart'],
  data (){
    return{
      cardList: this.deck && this.deck.cards ? this.deck.cards : [],
      deckName: this.deck && this.deck.name ? this.deck.name : '',
      nameMin: 3,
      nameMax: 128
    }
  },
  computed: {
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
      const newCard = JSON.parse(e.dataTransfer.getData('card'))
      if(!this.cardList.some(card => card.uuid === newCard.uuid)){
        this.addCardToCurrentDeck(newCard)
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
    handleDragStart: function (event, card) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('card', JSON.stringify(card))
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
</style>
