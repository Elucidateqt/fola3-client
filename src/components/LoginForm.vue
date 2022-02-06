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
        <q-input
          v-model="password"
          filled
          :type="hidePassword ? 'password' : 'text'"
          :label="$t('auth.password')"
        >
          <template #append>
            <q-icon
              :name="hidePassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="hidePassword = !hidePassword"
            />
          </template>
        </q-input>
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
          :label="$t('base.username')"
        />
        <q-input
          v-model="password"
          filled
          :type="hidePassword ? 'password' : 'text'"
          :label="$t('auth.password')"
        >
          <template #append>
            <q-icon
              :name="hidePassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="hidePassword = !hidePassword"
            />
          </template>
        </q-input>
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
//import {axiosAuth} from "../api/index.js";

export default {
  name: "LoginForm",

  components: {
  },
  data: () => ({
    tab: "login",
    email: null,
    username: null,
    password: null,
    hidePassword: true
  }),
  computed: {
    ...mapGetters('auth', ['isRefreshTokenValid'])
  },
  methods: {
    ...mapActions('auth', ['loginUser', 'signupUser']),
    async login() {
      try {
        await this.loginUser({email: this.email, password: this.password})
        this.$router.push({name: 'Home'})
        
      } catch (err) {
        console.error('Error logging in: ', err)
        
      }
    },
    async register() {
      try {
        await this.signupUser({email: this.email, username: this.username, password: this.password})
        await this.loginUser({email: this.email, username: this.username, password: this.password})
        this.$router.push({name: 'Home'})
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
