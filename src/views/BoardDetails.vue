<template>
  <div class="q-pa-md row items-start q-gutter-md">
     <div v-if="boardDetails !== null">
         name: {{boardDetails.name}}
         code: {{boardDetails.inviteCode}}
     </div>
     <div v-else>
         No board
     </div>
  </div>
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
    ...mapActions('boards', ['loadBoardDetails', 'joinBoardByInvite'])
  },

};
</script>
<style scoped>
.board-thumbnail {
height: auto;
width: 200px;
}
</style>
