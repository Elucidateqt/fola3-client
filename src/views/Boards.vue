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
          <q-icon :name="Object.keys(board.members).length > 1 ? 'group' : 'person'" size="md" />
        </div>
        <div class="update-timestamp">
          <span class="text-subtext" :aria-label="$t('boards.updated_at', {date: $d(board.createdAt, 'short')})">{{ $d(board.createdAt, 'short') }}</span>
        </div>
        <q-btn flat icon="more_vert">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable @click="activeBoardLeave = board.uuid" v-close-popup>
                <q-item-section>
                  <q-item-label>{{ $t('boards.leave_board') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="board.members[uuid].permissions.includes('API:BOARD:DELETE') || canDeleteBoards" clickable @click="deletionBoard = board.uuid" v-close-popup>
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


      <q-dialog v-model="deletionPending" class="q-pa-md" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">{{$t('boards.delete_board_confirm', {boardname: boards[deletionBoard].name})}}</span>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat :label="$t('base.cancel')" color="primary" @click="deletionBoard = null" v-close-popup />
          <q-btn flat :label="$t('base.delete')" color="primary" @click="handleBoardDeletion" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-dialog v-model="leavePending" class="q-pa-md" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">{{$t('boards.leave_board_confirm', {boardname: boards[activeBoardLeave].name})}}</span>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat :label="$t('base.cancel')" color="primary" @click="activeBoardLeave = null" v-close-popup />
          <q-btn flat :label="$t('boards.leave_board')" color="primary" @click="handleBoardLeave" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  data: () => ({
    deletionBoard: null,
    activeBoardLeave: null
  }),
  computed: {
    deletionPending () {
      return this.deletionBoard !== null
    },
    leavePending () {
      return this.activeBoardLeave !== null
    },
    canCreateBoards () {
      return this.userHasPermission()('API:BOARD:CREATE')
    },
    canDeleteBoards () {
      return this.userHasPermission()('API:BOARD:DELETE')
    },
    ...mapState('player', ['permissions', 'uuid']),
    ...mapState('boards', ['boards', 'hasMore'])
  },
  async created () {
    await this.loadOwnPermissions()
    this.$matomo && this.$matomo.trackPageView()
  },
  beforeUnmount() {
    this.resetBoards()
  },
  beforeRouteUpdate(to, from){
    this.resetBoards()
  },
  methods: {
    ...mapGetters('player', ['userHasPermission']),
    ...mapActions('player', ['loadOwnPermissions']),
    ...mapActions('boards', ['loadOwnBoards', 'resetBoards', 'resetBoardPagination', 'deleteBoard', 'leaveBoard']),
    loadMoreBoards (index, done) {
      if(this.hasMore){
        this.loadOwnBoards()
      }
      done()
    },
    formatBoardName (name) {
      return (name.length < 15) ? name : `${name.substring(0,12)}...`
    },
    async handleBoardLeave(){
      const boardId = this.activeBoardLeave
      this.activeBoardLeave = null
      await this.leaveBoard(boardId)

    },
    async handleBoardDeletion(){
      const boardId = this.deletionBoard
      this.deletionBoard = null
      await this.deleteBoard(boardId)
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
