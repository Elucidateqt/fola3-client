<template>
  <login-form />
  <q-page-sticky position="bottom-left">
    <server-status-indicator />
  </q-page-sticky>
</template>

<script>
// @ is an alias to /src
import LoginForm from "@/components/LoginForm.vue";
import ServerStatusIndicator from "@/components/ServerStatusIndicator"

export default {
  name: "Login",
  components: {
    LoginForm,
    ServerStatusIndicator
  },
};
</script>
