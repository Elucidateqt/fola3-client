<template>
    <q-card @click="openExternalLink" class="card">
        <q-card-section class="text-center">
          {{ name }}
        </q-card-section>
      <q-separator />
        <q-img :src="imageUrl" />
                <q-card-section>
          {{ description }}
        </q-card-section>
      <q-separator />
        <q-card-section class="text-center">
          <q-icon :name="getTypeIconName(cardType)" size="md" color="primary" />
        </q-card-section>
      <q-separator />
    </q-card>
</template>

<script>

export default {
  name: "Card",

  components: {
    
  },
  props: ['uuid', 'name', 'description', 'cardType', 'externalLink', 'imageUrl', 'interactionSubjectLeft', 'interactionSubjectRight', 'interactionDirection'],
  computed: {
  },
  methods: {
    openExternalLink: function (val){
      if(this.externalLink){
          window.open(this.externalLink , '_blank')
      }
    },
    getTypeIconName (type) {
      switch (type) {
        case 'interaction':
          return 'offline_bolt'
          break;
        default:
          return 'style'
          break;
      }
    },
  },

};
</script>
<style scoped>
.card:hover {
    cursor: pointer;
}
</style>
