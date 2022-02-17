<template>
  <q-input
    v-model="password"
    filled
    :type="hidePassword ? 'password' : 'text'"
    :label="label"
  >
    <template #append>
      <q-icon
        :name="hidePassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="hidePassword = !hidePassword"
      />
    </template>
  </q-input>
</template>

<script>

export default {
  name: "SecretInput",
  components: {
  },
  props: ['label'],
  data: () => ({
    password: null,
    hidePassword: true
  }),
  computed: {
    
  },
  methods: {

  },

};
</script>
