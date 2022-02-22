<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-infinite-scroll @load="loadMoreProjects" :offset="5">
      <q-card v-for="project in projects" :key="project.uuid" class="">
        <q-card-section @click="openProject(project.uuid)">
          <router-link :to="`/projects/${project.uuid}`">
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="project-thumbnail">
              <div class="absolute-bottom text-subtitle2 text-center">
                {{ project.name }}
              </div>
            </q-img>
          </router-link>
        </q-card-section>
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
  </div>
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
.project-thumbnail {
height: auto;
width: 200px;
}
</style>
