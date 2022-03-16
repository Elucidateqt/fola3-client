<template>
<q-page padding class="row justify-center">
  <div class="col-xs-8">
    <q-form class="row">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Sets"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        hint="With hide-selected and fill-input"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-btn flat :label="$t('base.update')" color="primary" type="submit" />
    </q-form>

  <q-infinite-scroll @load="loadMoreCards" :offset="5" class="row q-gutter-md">
    <fola-card v-for="card in cards" :key="card.uuid" class="col-xs-12 col-sm-4 col-md-4 col-lg-2"
    :name="card.names['en-US']"
    :uuid="card.uuid"
    :description="card.descriptions['en-US']"
    :external-link="card.knowledbaseUrl"
    :image-url="card.imageUrl"
    :type="card.cardType"
    :interactionSubjectLeft="card.interactionSubjectLeft"
    :interactionSubjectRight="card.interactionSubjectRight"
    :interactionDirection="card.interactionDirection"
    mode="edit"
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
    @click="showCardEditor = true"
  />
  </q-page-sticky>
  </div>
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
    showCardEditor: false,
  }),
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('cards', ['cards'])
  },
  async created () {
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('cards', ['loadAllAvailableCards']),
    loadMoreCards (index, done) {
      this.loadAllAvailableCards()
      done()
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
