<template>
    <q-infinite-scroll @load="loadMoreProjects" :offset="5" class="row q-gutter-md">
        <q-card v-for="project in projects" :key="project.uuid" class="col-xs-12 col-sm-4 col-md-2">
            <router-link :to="`/projects/${project.uuid}`">
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="project-thumbnail">
              </q-img>
          <q-card-section>
                  {{ project.name }}
          </q-card-section>
            </router-link>
          <q-separator />
          <q-card-actions align="around">
            <div class="member-count">
              <q-icon name="group" size="md" />
              <span class="text-h6">{{ project.members.length }}</span>
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
  <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="canCreateProjects">
    <project-creator />
  </q-page-sticky>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ProjectCreator from '@/components/ProjectCreator.vue'

export default {
  name: "Projects",
  components: {
    ProjectCreator
  },
  computed: {
    canCreateProjects () {
      return this.userHasPermission()('PROJECT:CREATE')
    },
    ...mapState('permissions', ['permissions']),
    ...mapState('projects', ['projects', 'hasMore'])
  },
  async created () {
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('projects', ['loadOwnProjects']),
    loadMoreProjects (index, done) {
      this.loadOwnProjects()
      done()
    }
  },

};
</script>
<style scoped>
</style>
