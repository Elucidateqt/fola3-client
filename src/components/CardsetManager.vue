<template>
  <div>
      <q-card v-if="selectedSet === null" class="q-pa-md scroll">
        <q-card-section>
          <q-list v-if="getPublicSets && getPublicSets.length > 0">
            <q-item v-for="set in getPublicSets" :key="set.uuid">
                <q-item-section side v-if="set.iconUrl && isImageUrl(set.iconUrl)">
                  <q-icon :name="`img:${set.iconUrl}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{set.name}}
                  </q-item-label>
                  <q-item-label caption :aria-label="$t('base.last_changed', {date: $d(set.createdAt, 'short')})">
                    {{ $t('base.last_changed', {date: $d(set.createdAt, 'short')}) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon :name="set.public === true ? 'visibility' : 'visibility_off'" />
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="edit" @click="handleSetSelection(set)" />
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="delete" @click="deletionSet = set" />
                </q-item-section>
            </q-item>
          </q-list>
          </q-card-section>
          <q-card-actions align="around">
            <q-btn @click="createTemplateCardset" :aria-label="$t('cardset.new_set')"  icon="add" />
          </q-card-actions>
      </q-card>

    <q-card v-else class="q-pa-md">
      <q-form @submit.prevent="updateSelectedSet">
          <q-input :label="$t('cardset.name')" v-model="editName" :rules="nameRules" />
          <q-input :label="$t('cardset.icon_url')" v-model="editIconUrl" :rules="imageUrlRules" />
          <q-img v-if="isImageUrl(editIconUrl)" :src="editIconUrl" />
          <q-toggle v-model="editIsPublic" :label="$t('cardset.public_visible')" />
          <q-card-actions align="around">
            <q-btn flat :label="$t('base.save')" :aria-label="$t('base.save')" :disable="!isFormValid" color="primary" type="submit" />
          </q-card-actions>
      </q-form>
    </q-card>
    <q-dialog v-model="deletionPending" class="q-pa-md" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">{{$t('cardset.delete_set_confirm', {setname: deletionSet.name})}}</span>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat :label="$t('base.cancel')" color="primary" @click="deletionSet = null" v-close-popup />
          <q-btn flat :label="$t('base.delete')" color="primary" @click="handleSetDeletion(deletionSet)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "CardsetManager",

  components: {

  },
  data: () => ({
    deletionSet: null,
    selectedSet: null,
    editName: null,
    editIconUrl: null,
    editIsPublic: null,
    nameMin: 3,
    nameMax: 128
  }),
  computed: {
    ...mapState('cardsets', ['cardsets']),
    ...mapGetters('cardsets', ['getPublicSets']),
    deletionPending: function(){
      return this.deletionSet !== null
    },
    nameRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.nameMin) || this.$i18n.t('validation.min_length', {"min": this.nameMin}),
      val => (val.length <= this.nameMax) || this.$i18n.t('validation.max_length', {"max": this.nameMax}),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    imageUrlRules: function () {
      return [
        val => (this.isImageUrl(val) || val === '') || this.$i18n.t('validation.invalid_url')
      ]
    },
    isFormValid: function () {
      return this.editName.length >= this.nameMin && this.editName.length <= this.nameMax 
      && !this.containsSpecialCharacters(this.editName)
      && (this.editIconUrl === '' || this.isImageUrl(this.editIconUrl))
    },
    getEditConfig: function () {
        return {
            "uuid": this.selectedSet.uuid,
            "name": this.editName,
            ...this.isImageUrl(this.editIconUrl) && { "iconUrl": this.editIconUrl },
            "public": this.editIsPublic
        }
    }
  },
  methods: {
    ...mapActions('cardsets', ['updateCardset', 'deleteCardset', 'createCardset']),
    ...mapActions('alert', ['setAlert']),
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
    },
    isValidUrl (val){
      return /^(ftp|http|https):\/\/[^ "]+$/.test(val)
    },
    isImageUrl(val){
      return this.isValidUrl(val) && (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(val)
    },
    handleSetSelection(set) {
        this.editName = set.name || ''
        this.editIconUrl = set.iconUrl || ''
        this.editIsPublic = set.public || false
        this.selectedSet = Object.assign({},set)
    },
    resetSelectedSet() {
      this.selectedSet = null
      this.editIsPublic = null
      this.editIconUrl = null,
      this.editName = null
    },
    async createTemplateCardset() {
      try {
        await this.createCardset({set: {
          "name": this.$t('cardset.new_set'),
          "owner": "public",
          "public": false
        }})
        const newSet = Object.assign({}, this.cardsets[0])
        this.editName = newSet.name
        this.editIconUrl = newSet.iconUrl || ''
        this.editIsPublic = newSet.public
        this.selectedSet = newSet
      } catch (err) {
        this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('errors.default'),
        })
      }
    },
    async updateSelectedSet() {
      if(!this.isFormValid){
        return
      }
      try {
        await this.updateCardset({"set": this.getEditConfig})
        this.resetSelectedSet()
        this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('cardset.confirm_update'),
        })

      } catch (err) {
        this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('errors.default'),
        })
      }
    },
    async createNewCardset() {
        try {
            await this.createCardset({"set": {
                "name": this.$t('cardset.new_cardset'),
                "public": false
            }})
            this.selectedSet = Object.assign({}, this.cardsets[this.cardsets.length])
        } catch (err) {
                    this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('errors.default'),
        })
        }

    },
    showDeletionGuard(set){
      this.deletionSet = set
    },
    async handleSetDeletion(set) {
        try {
            await this.deleteCardset({"set": set})
            this.deletionSet = null
            this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('cardset.confirm_deletion'),
        })
        } catch (err) {
        this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('cardset.confirm_deletion'),
        })
        }
    }
  },

};
</script>
<style scoped>
.cardset-form {
  width: 700px;
  max-width: 80vw;
}

</style>
