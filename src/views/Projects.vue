<template>
  <h1>This is the projects page</h1>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      v-if="canCreateProjects"
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

  },
  computed: {

  },
  async created () {
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    canCreateProjects () {
      return this.userHasPermission('PROJECT:CREATE')
    },
    createProject (){
      console.log('create project popup', this.userHasPermission('PROJECT:CREATE'))
    },
  },

};
</script>
