<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="row nowrap"
    >
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title> My App </q-toolbar-title>
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
            :aria-label="$t('nav.projects')"
            :label="$t('nav.projects')"
            to="/projects"
          />
          <q-separator dark vertical />
          <q-route-tab
            flat
            stretch
            :aria-label="$t('nav.profile')"
            :label="$t('nav.profile')"
            :to="`/users/${uuid}`"
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
          <q-seperator dark vertical />
        </div>
        <locale-changer />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <router-view />
        <q-page-sticky position="bottom-left" :offset="[18, 18]" v-if="canReportBugs">
          <bug-reporter />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import LocaleChanger from '@/components/LocaleChanger.vue'
import BugReporter from '@/components/BugReporter.vue'

export default {
  name: "LayoutDefault",

  components: {
    LocaleChanger,
    BugReporter
  },
  data: () => ({
    toastMessage: null,
    showBugreporter: false,
  }),
  computed: {
    ...mapState('auth', ['isLoggedIn']),
    ...mapGetters('auth', ['isAccessTokenValid', 'isRefreshTokenValid', 'isLoggedIn']),
    ...mapState('player', ['uuid']),
    canReportBugs () {
      return this.userHasPermission()('BUGREPORT:CREATE')
    },
  },
  async created () {
    if(this.isRefreshTokenValid){
      this.SET_REFRESH_TOKEN({token: localStorage.getItem('refresh_token')})
      await this.request_new_tokens()
    }
  },
  methods: {
    ...mapActions('auth', ['request_new_tokens', 'logoutUser']),
    ...mapMutations('auth', ['SET_REFRESH_TOKEN']),
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['resetPermissions']),
    async logout(){
      await this.logoutUser()
      this.resetPermissions()
      this.$router.push({name: 'Landing'})
    }
  },
};
</script>
