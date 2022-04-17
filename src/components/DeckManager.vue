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
    selectedDeck: null
  }),
  computed: {
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
    ...mapActions('decks', ['loadOwnDecks', 'createOwnDeck', 'setCurrentDeck', 'resetDecks']),
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
</style>
