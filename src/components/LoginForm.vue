<template>
  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab
        name="login"
        :label="$t('auth.login')"
      />
      <q-tab
        name="register"
        :label="$t('auth.signup')"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
      swipeable
    >
      <q-tab-panel
        name="login"
        class="q-gutter-md"
      >
        <q-input
          v-model="email"
          outlined
          type="email"
          :label="$t('auth.email')"
        />
        <secret-input
          v-model="password"
          :label="$t('auth.password')"
        />
        <q-btn
          :label="$t('auth.login')"
          type="submit"
          color="primary"
          @click="login"
        />
        <span v-if="isRefreshTokenValid">
          logged in
        </span>
      </q-tab-panel>

      <q-tab-panel
        name="register"
        class="q-gutter-md"
      >
        <q-input
          v-model="email"
          outlined
          type="email"
          :label="$t('auth.email')"
        />
        <q-input
          v-model="username"
          outlined
          :label="$t('profile.username')"
        />
        <secret-input
          v-model="password"
          :label="$t('auth.password')"
        />
        <q-btn
          :label="$t('auth.signup')"
          type="submit"
          color="primary"
          @click="register"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import SecretInput from '@/components/SecretInput.vue';
//import {axiosAuth} from "../api/index.js";

export default {
  name: "LoginForm",

  components: {
    SecretInput
  },
  data: () => ({
    tab: "login",
    email: null,
    username: null,
    password: null
  }),
  computed: {
    ...mapGetters('auth', ['isRefreshTokenValid'])
  },
  methods: {
    ...mapActions('auth', ['loginUser', 'signupUser']),
    ...mapActions('player', ['loadOwnPermissions', 'loadOwnProfile']),
    async login() {
      try {
        await this.loginUser({email: this.email, password: this.password})
        await this.loadOwnProfile()
        await this.loadOwnPermissions()
        if(this.$route.query.redirect){
          this.$router.push(this.$route.query.redirect)
        }else{
          this.$router.push({name: 'Boards'})
        }
      } catch (err) {
        console.error('Error logging in: ', err)
        
      }
    },
    async register() {
      try {
        await this.signupUser({email: this.email, username: this.username, password: this.password})
        await this.login()
      } catch (err) {
        console.error('Error creating account: ', err)
      }
    },
    async checkHealth() {
      try {
        const res = await Api().get(`/health`);
        this.online = true
      } catch (err) {
        this.online = false
      }
    }
  },

};
</script>
