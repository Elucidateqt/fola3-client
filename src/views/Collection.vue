<template>
<q-page padding class="row justify-center">
  <div class="col-xs-8">
    <q-form class="row">
          <q-option-group
      v-model="selectedSets"
      :options="getCheckboxOptions"
      color="primary"
      type="checkbox"
      inline
    />
    </q-form>


  <q-infinite-scroll @load="loadMoreCards" :offset="50" class="row q-gutter-md">
    <fola-card v-for="card in cards" :key="card.uuid" class="col-xs-12 col-sm-4 col-md-4 col-lg-2"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import FolaCard from '@/components/FolaCard.vue'

export default {
  name: "Collection",
  components: {
    FolaCard
  },
  data: () => ({
    cardCreatorVisible: false,
    selectedSets: []
  }),
  watch: {
    selectedSets(newSelection, oldSelection) {
      this.resetCards()
    }
  },
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('cards', ['cards']),
    ...mapState('cardsets', ['ownSets']),
    ...mapGetters('cardsets', ['getCheckboxOptions'])
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
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('cardsets', ['loadOwnCardSets', 'loadPublicCardSets', 'loadWIPCardSets']),
    ...mapActions('cards', ['loadCards', 'resetCards', 'createCard', 'deleteCard', 'updateCard']),
    loadMoreCards (index, done) {
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
      handleSetChange(data) {
    console.log("handlesetchange", data)
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
    }
  },

};
</script>
<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
