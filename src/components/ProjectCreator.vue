<template>
  <q-btn
    round
    color="accent"
    :aria-label="$t('projects.create')"
    icon="add"
    @click="showForm = true"
  />
  <q-dialog v-model="showForm">
    <q-card class="creation-form">
      <q-form @submit.prevent="createNewProject">
        <q-card-section>
          <div class="text-h6 text-center">{{$t('projects.create')}}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4">{{$t('projects.name')}}:</div>
          <q-input v-model="projectName" filled label="" :rules="nameRules" />
          <span>
            {{$t('validation.curr_length', {"curr": projectName.length, "max": nameMax})}}
          </span>
        </q-card-section>

        <q-card-section style="min-height: 20vh">
          <div class="text-h4">{{$t('projects.description')}}:</div>
            <q-input v-model="projectDescription" filled type="textarea" :rules="descriptionRules" />
          <span>
            {{$t('validation.curr_length', {"curr": projectDescription.length, "max": descriptionMax})}}
          </span>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn flat :label="$t('projects.create')" :disable="!isFormValid" color="primary" type="submit" />
          <q-btn flat :label="$t('base.cancel')" color="primary" v-close-popup type="reset" />
        </q-card-actions>
      </q-form>
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
    projectDescription: "",
    nameMin: 10,
    nameMax: 128,
    descriptionMin: 10,
    descriptionMax: 256
  }),
  computed: {
    descriptionRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.descriptionMin) || this.$i18n.t('validation.min_length', {"min": this.descriptionMin}),
      val => (val.length <= this.descriptionMax) || this.$i18n.t('validation.max_length', {"max": this.descriptionMax  }),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    nameRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.nameMin) || this.$i18n.t('validation.min_length', {"min": this.nameMin}),
      val => (val.length <= this.nameMax) || this.$i18n.t('validation.max_length', {"max": this.nameMax}),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    isFormValid: function () {
      return this.projectName.length >= this.nameMin && this.projectName.length <= this.nameMax 
      && this.projectDescription.length >= this.descriptionMin && this.projectDescription.length <= this.descriptionMax
      && !this.containsSpecialCharacters(this.projectName) && !this.containsSpecialCharacters(this.projectDescription)
    }
  },
  methods: {
    ...mapActions('projects', ['createProject']),
    ...mapActions('alert', ['setAlert']),
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
    },
    async createNewProject() {
      if(!this.isFormValid){
        return
      }
      try {
        await this.createProject({"name": this.projectName, "description": this.projectDescription})
        this.showForm = false
        this.projectName = "",
        this.projectDescription = ""
        this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('projects.confirm_creation'),
        })
      } catch (err) {
        
        
      }
    }
  },

};
</script>
<style scoped>
.creation-form {
  width: 700px;
  max-width: 80vw;
}

</style>
