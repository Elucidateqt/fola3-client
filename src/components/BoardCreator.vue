<template>
  <q-btn
    round
    color="accent"
    :aria-label="$t('boards.create')"
    icon="add"
    @click="showForm = true"
  />
  <q-dialog v-model="showForm">
    <q-card class="creation-form">
      <q-form @submit.prevent="createNewBoard">
        <q-card-section>
          <div class="text-h6 text-center">{{$t('boards.create')}}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4">{{$t('boards.name')}}:</div>
          <q-input v-model="boardName" filled label="" :rules="nameRules" />
          <span>
            {{$t('validation.curr_length', {"curr": boardName.length, "max": nameMax})}}
          </span>
        </q-card-section>

        <q-card-section style="min-height: 20vh">
          <div class="text-h4">{{$t('boards.description')}}:</div>
            <q-input v-model="boardDescription" filled type="textarea" :rules="descriptionRules" />
          <span>
            {{$t('validation.curr_length', {"curr": boardDescription.length, "max": descriptionMax})}}
          </span>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn flat :label="$t('boards.create')" :disable="!isFormValid" color="primary" type="submit" />
          <q-btn flat :label="$t('base.cancel')" color="primary" v-close-popup type="reset" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "BoardCreator",

  components: {
    
  },
  data: () => ({
    showForm: false,
    boardName: "",
    boardDescription: "",
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
      return this.boardName.length >= this.nameMin && this.boardName.length <= this.nameMax 
      && this.boardDescription.length >= this.descriptionMin && this.boardDescription.length <= this.descriptionMax
      && !this.containsSpecialCharacters(this.boardName) && !this.containsSpecialCharacters(this.boardDescription)
    }
  },
  methods: {
    ...mapActions('boards', ['createBoard']),
    ...mapActions('alert', ['setAlert']),
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
    },
    async createNewBoard() {
      if(!this.isFormValid){
        return
      }
      try {
        await this.createBoard({"name": this.boardName, "description": this.boardDescription})
        this.showForm = false
        this.boardName = "",
        this.boardDescription = ""
        this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('boards.confirm_creation'),
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
