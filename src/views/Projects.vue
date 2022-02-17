<template>
  <h1>This is the projects page</h1>
  <div>Permissions:{{permissions}}</div>
  <div>canCreateProject:{{canCreateProjects}}</div>
  <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="canCreateProjects">
    <q-btn
      round
      color="accent"
      :aria-label="$t('projects.create')"
      icon="add"
      @click="createProject"
    />
  </q-page-sticky>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: "Projects",
  components: {
  },
  computed: {
    canCreateProjects () {
      return this.userHasPermission()('PROJECT:CREATE')
    },
    ...mapState('permissions', ['permissions'])
  },
  async created () {
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    createProject (){
      
    },
  },

};
</script>
