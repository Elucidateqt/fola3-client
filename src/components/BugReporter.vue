<template>
  <q-btn
    round
    color="accent"
    :aria-label="$t('base.report_bug')"
    icon="bug_report"
    @click="showForm = true"
  />
  <q-dialog v-model="showForm">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{$t('bugreport.title')}}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 20vh" class="scroll">
        <div class="text-h4">{{$t('bugreport.location_question')}}</div>
        <q-select :options="bugLocationList" filled v-model="bugLocation" />
      </q-card-section>

      <q-card-section style="max-height: 20vh" class="scroll">
        <div class="text-h4">{{$t('bugreport.summary_ask')}}:</div>
        <q-input v-model="bugSummary" filled label=""/>
      </q-card-section>

      <q-card-section style="max-height: 20vh" class="scroll">
        <div class="text-h4">{{$t('bugreport.description_ask')}}:</div>
        <div class="q-pa-md" style="max-width: 100vw">
          <q-input v-model="bugDescription" filled type="textarea"/>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="$t('base.submit')" color="primary" @click="sendBugReport" />
        <q-btn flat :label="$t('base.cancel')" color="primary" v-close-popup />
      </q-card-actions>
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
    bugLocationList: ["Home Screen", "Collection", "Projects", "User Profile", "Other"],
    bugLocation: "Home Screen",
    bugSummary: "",
    bugDescription: ""
  }),
  computed: {

  },
  methods: {
    ...mapActions('bugreports', ['submitBugReport']),
    async sendBugReport() {
      try {
        await this.submitBugReport({"location": this.bugLocation, "summary": this.bugSummary, "description": this.bugDescription})
        this.showForm = false
        this.bugLocation = "Home Screen",
        this.bugSummary = "",
        this.bugDescription = ""
      } catch (err) {
        console.error('Error submitting bugreport: ', err)
        
      }
    }
  },

};
</script>
