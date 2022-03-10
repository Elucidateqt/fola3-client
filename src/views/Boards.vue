<template>
<q-page padding class="row justify-center">
  <div class="col-xs-8">
  <q-infinite-scroll @load="loadMoreBoards" :offset="5" class="row q-gutter-md">
    <q-card v-for="board in boards" :key="board.uuid" class="col-xs-12 col-sm-4 col-md-4 col-lg-2">
      <router-link :to="`/boards/${board.uuid}`">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="board-thumbnail" />
        <q-card-section>
          {{ board.name }}
        </q-card-section>
      </router-link>
      <q-separator />
      <q-card-actions align="around">
        <div>
          <q-icon :name="board.members.length > 1 ? 'group' : 'person'" size="md" />
        </div>
        <div class="update-timestamp">
          <span class="text-subtext" :aria-label="$t('boards.updated_at', {date: $d(board.createdAt, 'short')})">{{ $d(board.createdAt, 'short') }}</span>
        </div>
        <q-btn flat icon="more_vert" />
      </q-card-actions>
    </q-card>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
  </div>
  <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="canCreateBoards">
    <board-creator />
  </q-page-sticky>
</q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import BoardCreator from '@/components/BoardCreator.vue'

export default {
  name: "Boards",
  components: {
    BoardCreator
  },
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('boards', ['boards', 'hasMore'])
  },
  async created () {
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('boards', ['loadOwnBoards']),
    loadMoreBoards (index, done) {
      this.loadOwnBoards()
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
