<template>
  <div class="q-pa-md row items-start q-gutter-md">
     <div v-if="projectDetails !== null">
         name: {{projectDetails.name}}
         code: {{projectDetails.inviteCode}}
     </div>
     <div v-else>
         No project
     </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: "ProjectDetails",
  components: {
  },
  computed: {
    canCreateProjects () {
      return this.userHasPermission()('PROJECT:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('projects', ['projectDetails'])
  },
  async created () {
    if(this.$route.query.code){
        await this.joinProjectByInvite({uuid: this.$route.params.id, inviteCode: this.$route.query.code})
    }
    await this.loadProjectDetails(this.$route.params.id)
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('projects', ['loadProjectDetails', 'joinProjectByInvite'])
  },

};
</script>
<style scoped>
.project-thumbnail {
height: auto;
width: 200px;
}
</style>
