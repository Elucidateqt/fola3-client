
<template>
  <div
    style="cursor: pointer"
    @click="isOpen = !isOpen"
  >
    <q-chip
      v-if="isOpen === false"
      square
      text-color="white"
      :color="getTypeColor(cards[cardId].cardType)"
      class="plugin-chip"
      :icon="getTypeIconName(cards[cardId].cardType)"
    >
      {{ cards[cardId].name }}
    </q-chip>
    <fola-card
      v-else
      allow-edit="true"
      :allow-pick-up="true"
      :allow-copy-to-hand="true"
      :disable-type-edit="true"
      :name="cards[cardId].name"
      :uuid="cards[cardId].uuid"
      :description="cards[cardId].description"
      :external-link="cards[cardId].externalLink"
      :image-url="cards[cardId].imageUrl"
      :type="cards[cardId].cardType"
      :interaction-subject-left="cards[cardId].interactionSubjectLeft"
      :interaction-subject-right="cards[cardId].interactionSubjectRight"
      :interaction-direction="cards[cardId].interactionDirection"
      :addons-top="cards[cardId].addonsTop"
      :addons-bot="cards[cardId].addonsBot"
      mode="view"
      @pick-up-card="$emit('addonPickedUp')"
      @card-edit-submitted="(editConfig) => $emit('addonEditSubmitted', editConfig)"
      @card-copy-submitted="$emit('addonCopySubmitted', $event)"
    />
  </div>
</template>


<script>

import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent ({
  name: "FolaCardAddon",
  components: {

  },
  props: {
    'cardId': {
      type: String,
      default: null
    }
  },
  emits: ['addonEditSubmitted', 'addonPickedUp', 'addonCopySubmitted'],
  data: () => ({
    isOpen: false,
  }),
  computed: {
      ...mapState('activeBoard', ['cards'])
    
  },
  methods: {
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
  },
});
</script>

<style scoped>
.plugin-chip {
  width: 200px;
  max-width: 50vw;
}
</style>
