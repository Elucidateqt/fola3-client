<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      class="glossy"
    >
      <q-toolbar>
        <q-toolbar-title> Quasar App </q-toolbar-title>
        <q-btn
          v-if="isLoggedIn"
          flat
          dense
          round
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
        <locale-changer />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import LocaleChanger from '@/components/LocaleChanger.vue'

export default {
  name: "LayoutDefault",

  components: {
    LocaleChanger
  },
  data: () => ({
    toastMessage: null
  }),
  computed: {
    ...mapState('auth', ['isLoggedIn']),
    ...mapGetters('auth', ['isAccessTokenValid', 'isRefreshTokenValid'])
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
    async logout(){
      await this.logoutUser()
      this.$router.push({name: 'Landing'})
    }
  },
};
</script>
