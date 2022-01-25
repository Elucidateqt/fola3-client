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
        label="Login"
      />
      <q-tab
        name="register"
        label="Register"
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
          label="Email"
        />
        <q-input
          v-model="password"
          filled
          :type="hidePassword ? 'password' : 'text'"
          label="Password"
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
          label="Login"
          type="submit"
          color="primary"
          @click="login"
        />
      </q-tab-panel>

      <q-tab-panel
        name="register"
        class="q-gutter-md"
      >
        <q-input
          v-model="email"
          outlined
          type="email"
          label="Email"
        />
        <q-input
          v-model="username"
          outlined
          label="Username"
        />
        <q-input
          v-model="password"
          filled
          :type="hidePassword ? 'password' : 'text'"
          label="Password"
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
          label="Create Account"
          type="submit"
          color="primary"
          @click="register"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import {axiosAuth} from "../api/index.js";

export default {
  name: "Login",

  components: {
  },
  data: () => ({
    tab: "login",
    email: null,
    username: null,
    password: null,
    hidePassword: true
  }),
  methods: {
    async login() {
      try {
        const res = await axiosAuth.post("/auth/login", {
          email: this.email,
          password: this.password
        })
        
      } catch (err) {
        console.error('Error logging in: ', err)
        
      }
    },
    async register() {
      try {
        const res = await axiosAuth.post("/auth/signup", {
          email: this.email,
          username: this.username,
          password: this.password
        })
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
