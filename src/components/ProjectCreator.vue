<template>
  <q-btn
    round
    color="accent"
    :aria-label="$t('projects.create')"
    icon="add"
    @click="showForm = true"
  />
  <q-dialog v-model="showForm">
    <q-card class="scroll">
      <q-card-section>
        <div class="text-h6">{{$t('projects.create')}}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 20vh">
        <div class="text-h4">{{$t('projects.name')}}:</div>
        <q-input v-model="projectName" filled label=""/>
      </q-card-section>

      <q-card-section style="max-height: 20vh">
        <div class="text-h4">{{$t('projects.description')}}:</div>
        <div class="q-pa-md" style="max-width: 100vw">
          <q-input v-model="projectDescription" filled type="textarea"/>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="around">
        <q-btn flat :label="$t('projects.create')" color="primary" @click="createNewProject" />
        <q-btn flat :label="$t('base.cancel')" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "ProjectCreator",

  components: {
    
  },
  data: () => ({
    showForm: false,
    projectName: "",
    projectDescription: ""
  }),
  computed: {

  },
  methods: {
    ...mapActions('projects', ['createProject']),
    async createNewProject() {
      try {
        await this.createProject({"name": this.projectName, "description": this.projectDescription})
        this.showForm = false
        this.projectName = "",
        this.projectDescription = ""
      } catch (err) {
        console.error('Error creating project: ', err)
        
      }
    }
  },

};
</script>
