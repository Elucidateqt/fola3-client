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
        <q-tab-panel v-for="player in activeBoardPlayers" :key="`hand_panel_${player.uuid}`" :name="player.uuid">
          <q-scroll-area class="player-card-container">
            {{activeBoardHands}}
            <div class="q-pa-md row items-start q-gutter-md">
              <fola-card 
                v-for="card of activeBoardHands[player.uuid]" 
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
                mode="view"
                allow-drag="true"
                @dragstart="handleDragStart($event, player.uuid)"
              />
            </div>
          </q-scroll-area>
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
  data () {
      return {
          tab: this.uuid,
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
    handleDragStart: function (event, playerId) {
      const origin = {
        playerId: playerId,
        container: "hand"
      }
      const originString = JSON.stringify(origin)
      event.dataTransfer.setData('cardOrigin', originString)
    },
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
</style>
