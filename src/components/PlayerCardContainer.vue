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
          <q-tab v-for="player in playerConfigs" :key="player.uuid" :name="player.uuid" :label="player.username" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated swipeable>
          <q-tab-panel v-for="player in playerConfigs" :key="player.uuid" :name="player.uuid">
            <q-scroll-area class="player-card-container">
            <div class="q-pa-md row items-start q-gutter-md">

    <card v-for="card in player.cards" :key="card.uuid" class="col-xs-12 col-sm-4 col-md-4 col-lg-2"
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
    />
            </div>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Card from '@/components/Card.vue'

export default {
  name: "PlayerCardContainer",

  components: {
      Card
  },
  props: {
      players: {
          type: Array,
          required: true
      }
  },
  data () {
      return {
          tab: this.uuid,
          playerConfigs: this.players,

      }
  },
  computed: {
    ...mapState('player', ['username', 'uuid']),
    bearerUsername: function () {
        return this.username
    }
  },
  async created () {
      this.tab = this.uuid
  },
  methods: {
    ...mapActions('permissions', ['loadUserPermissions'])
  },

};
</script>
<style scoped>
.player-card-container {
  height: 40vh;
  max-height: 300px;
  width: 700px;
  max-width: 80vw;
}
</style>