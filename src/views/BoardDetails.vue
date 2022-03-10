<template>
  <q-page>
    <div class="q-pa-md row items-start q-gutter-md">
      <div v-if="boardDetails !== null">
        name: {{boardDetails.name}}
        code: {{boardDetails.inviteCode}}

        <q-btn v-if="canCopyToClipboard" flat :label="$t('boards.copy_link')" :aria-label="$t('boards.copy_link')" @click="copyInviteLink" color="primary" />
      </div>
      <div v-else>
        No board
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: "BoardDetails",
  components: {
  },
  computed: {
    canCreateBoards () {
      return this.userHasPermission()('BOARD:CREATE')
    },
    canCopyToClipboard () {
      return this.boardDetails.inviteCode && navigator.clipboard
    },
    inviteUrl () {
      return `${window.location.origin}/boards/${this.boardDetails.uuid}?inv=${this.boardDetails.inviteCode}`
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('boards', ['boardDetails'])
  },
  async created () {
    if(this.$route.query.inv){
        await this.joinBoardByInvite({uuid: this.$route.params.id, inviteCode: this.$route.query.inv})
    }
    await this.loadBoardDetails(this.$route.params.id)
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('boards', ['loadBoardDetails', 'joinBoardByInvite']),
    ...mapActions('alert', ['setAlert']),
    async copyInviteLink () {
      await navigator.clipboard.writeText(this.inviteUrl)
      this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('boards.link_copied'),
      })
    }
  },

};
</script>
<style scoped>
.board-thumbnail {
height: auto;
width: 200px;
}
</style>
