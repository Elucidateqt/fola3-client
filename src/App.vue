<template>
  <q-layout view="hhh lpR fff">
    <q-header
      elevated
      class="row nowrap"
    >
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title> FOLA³ </q-toolbar-title>
        <q-tabs
          v-if="isLoggedIn"
        >
          <q-route-tab
            flat
            stretch
            :aria-label="$t('nav.home')"
            :label="$t('nav.home')"
            to="/home"
          />
          <q-separator dark vertical />
          <q-route-tab
            flat
            stretch
            :aria-label="$t('nav.boards')"
            :label="$t('nav.boards')"
            to="/boards"
          />
          <q-separator dark vertical />
          <q-route-tab
            flat
            stretch
            :aria-label="$t('nav.profile')"
            :label="$t('nav.profile')"
            :to="`/users/${uuid}`"
          />
          <q-route-tab
            flat
            stretch
            :aria-label="$t('nav.collection')"
            :label="$t('nav.collection')"
            to="/collection"
          />
        </q-tabs>
        <div id="auth-buttons" class="row">
          <q-btn
            v-if="isLoggedIn"
            flat
            stretch
            :aria-label="$t('auth.logout')"
            icon="logout"
            @click="logout"
          />
          <q-btn
            v-else
            flat
            dense
            round
            :aria-label="$t('auth.login')"
            icon="login"
            to="/login"
          />
          <q-separator dark vertical />
        </div>
        <locale-changer />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <q-page-sticky position="bottom-left" :offset="[18, 18]" v-if="canReportBugs">
        <bug-reporter />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import LocaleChanger from '@/components/LocaleChanger.vue'
import BugReporter from '@/components/BugReporter.vue'
import { Notify } from 'quasar'

export default {
  name: "LayoutDefault",

  components: {
    LocaleChanger,
    BugReporter
  },
  data: () => ({
    showBugreporter: false,
  }),
  computed: {
    ...mapState('auth', ['isLoggedIn']),
    ...mapGetters('auth', ['isAccessTokenValid', 'isRefreshTokenValid', 'isLoggedIn']),
    ...mapState('player', ['uuid']),
    ...mapGetters('alert', ['alertMessage', 'alertVisible', 'alertType']),
    canReportBugs () {
      return this.userHasPermission()('BUGREPORT:CREATE')
    },
  },
  watch: {
    //create new toast-popup if alertVisible in store is changed to true
    alertVisible: function (alertVisible) {
      if(!alertVisible){
        return
      }
      Notify.create({
        type: this.alertType,
        message: this.alertMessage,
        timeout: 1500
      })
      this.resetAlert()
    }
  },
  async created () {
    if(this.isRefreshTokenValid){
      this.SET_REFRESH_TOKEN({token: localStorage.getItem('refresh_token')})
      await this.request_new_tokens()
      await this.loadOwnProfile()
    }
  },
  methods: {
    ...mapActions('auth', ['request_new_tokens', 'logoutUser']),
    ...mapMutations('auth', ['SET_REFRESH_TOKEN']),
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['resetPermissions']),
    ...mapActions('alert', ['resetAlert']),
    ...mapActions('player', ['loadOwnProfile', 'resetPlayerData']),
    async logout(){
      await this.logoutUser()
      this.resetPermissions()
      this.resetPlayerData()
      this.$router.push({name: 'Landing'})
    }
  },
};
</script>
