<template>
  <q-page class="row items-center justify-center">
    <login-form class="col-xs-10 col-sm-6 col-md-4 col-lg-2"/>
    <q-page-sticky position="bottom-left">
      <server-status-indicator />
    </q-page-sticky>
  </q-page>
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
