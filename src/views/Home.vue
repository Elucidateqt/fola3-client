<template>
  <div class="home">
    <router-link to="/login">
      {{$t('auth.login')}}
    </router-link>
  </div>
</template>

<script>

export default {
  name: "Home",
  components: {
  },
};
</script>
