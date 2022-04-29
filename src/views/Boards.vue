<template>
<q-page padding class="row justify-center">
  <div class="col-xs-8">
  <q-infinite-scroll @load="loadMoreBoards" :offset="5" class="row q-gutter-md">
    <q-card v-for="board in boards" :key="board.uuid" class="col-xs-12 col-sm-4 col-md-4 col-lg-2">
      <router-link :to="`/boards/${board.uuid}`">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="board-thumbnail" />
        <q-card-section>
          {{ formatBoardName(board.name) }}
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
        <q-btn flat icon="more_vert">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable @click="deleteBoard(board)">
                <q-item-section>
                  <q-item-label>{{ $t('base.delete') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
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
      return this.userHasPermission()('API:BOARD:CREATE')
    },
    ...mapState('player', ['permissions']),
    ...mapState('boards', ['boards', 'hasMore'])
  },
  async created () {
    await this.loadOwnPermissions()
  },
  beforeUnmount() {
    this.resetBoards()
  },
  methods: {
    ...mapGetters('player', ['userHasPermission']),
    ...mapActions('player', ['loadOwnPermissions']),
    ...mapActions('boards', ['loadOwnBoards', 'resetBoards']),
    loadMoreBoards (index, done) {
      this.loadOwnBoards()
      done()
    },
    formatBoardName (name) {
      return (name.length < 15) ? name : `${name.substring(0,12)}...`
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
