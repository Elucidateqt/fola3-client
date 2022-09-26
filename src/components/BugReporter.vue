<template>
  <q-btn
    round
    color="accent"
    :aria-label="$t('bugreport.title')"
    icon="bug_report"
    @click="showForm = true"
  />
  <q-dialog v-model="showForm">
    <q-card class="report-form">
      <q-form
        ref="reportForm"
        @submit.prevent="sendBugReport"
      >
        <q-card-section>
          <div class="text-h6 text-center">
            {{ $t('bugreport.title') }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section style="min-height: 20vh">
          <div class="text-h4">
            {{ $t('bugreport.summary_ask') }}:
          </div>
          <q-input
            v-model="bugSummary"
            filled
            label=""
            :rules="summaryRules"
          />
          <span>
            {{ $t('validation.curr_length', {"curr": bugSummary.length, "max": summaryMax}) }}
          </span>
        </q-card-section>
        <q-card-section class="scroll">
          <div class="text-h4">
            {{ $t('bugreport.description_ask') }}:
          </div>
          <div class="col-12">
            <q-input
              v-model="bugDescription"
              filled
              type="textarea"
              :rules="descriptionRules"
            />
            <span>
              {{ $t('validation.curr_length', {"curr": bugDescription.length, "max": descriptionMax}) }}
            </span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn
            flat
            :label="$t('base.submit')"
            :aria-label="$t('base.submit')"
            :disable="!isFormValid"
            color="primary"
            type="submit"
          />
          <q-btn
            v-close-popup
            flat
            :label="$t('base.cancel')"
            :aria-label="$t('base.cancel')"
            color="primary"
            type="reset"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "BugReporter",

  components: {
    
  },
  data: () => ({
    showForm: false,
    bugSummary: "",
    bugDescription: "",
    summaryMin: 10,
    summaryMax: 128,
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
    summaryRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.summaryMin) || this.$i18n.t('validation.min_length', {"min": this.summaryMin}),
      val => (val.length <= this.summaryMax) || this.$i18n.t('validation.max_length', {"max": this.summaryMax}),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    isFormValid: function () {
      return this.summaryMin <= this.bugSummary.length && this.bugSummary.length <= this.summaryMax
      && this.descriptionMin <= this.bugDescription.length && this.bugDescription.length <= this.descriptionMax
      && !this.containsSpecialCharacters(this.bugSummary) && !this.containsSpecialCharacters(this.bugDescription)
    }
  },
  methods: {
    ...mapActions('bugreports', ['submitBugReport']),
    ...mapActions('alert', ['setAlert']),
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
    },
    async sendBugReport() {
      if(!this.isFormValid){
        return
      }
      try {
        await this.submitBugReport({"route": this.$route.fullPath, "summary": this.bugSummary, "description": this.bugDescription})
        this.showForm = false
        this.bugSummary = "",
        this.bugDescription = ""
        this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('bugreport.thanks'),
        })
      } catch (err) {
        console.error('Error submitting bugreport: ', err)
        
      }
    }
  },

};
</script>
<style scoped>
.report-form {
  width: 700px;
  max-width: 80vw;
}
</style>
