<template>
  <div>
    <div v-for="(cardId) in addonsTop" :key="cardId" class="row items-start q-gutter-xs">
      <fola-card-addon :card-id="cardId" @addonEditSubmitted="(config) => $emit('cardEditSubmitted', config)" @addonPickedUp="handlePluginRemove($event, cardId)" />
    </div>
    <q-card class="card-view" :draggable="allowDrag || false" @dragstart="handleDragStart($event, uuid)" @dragleave="activeDrag = null">
      <q-separator />
      <q-card-section class="text-center row">
        <div class="col-9 text-weight-bold">{{ name }}</div>
        <q-icon class="col-3" :name="getTypeIconName(type)" size="sm" :color="getTypeColor(type)" />
      </q-card-section>
      <q-separator />
      <q-card-section v-if="type === 'interaction'" class="row justify-around">
        <q-icon class="col-4" :name="getInteractionSubjectIconName(subjectLeftModel.value)" size="md" color="primary" />
        <q-icon class="col-4" :name="getDirectionIconName(interactionDirectionModel.value)" size="md" color="primary" />
        <q-icon class="col-4" :name="getInteractionSubjectIconName(subjectRightModel.value)" size="md" color="primary" />
      </q-card-section>
      <q-card-section v-else>
        <q-img :src="imageUrl" v-if="isImageUrl(imageUrl)" :ratio="4/3" />
        <div v-else class="image-placeholder text-center">
          {{$t('validation.no_image')}}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        {{ description }}
      </q-card-section>
      <q-separator />
      <q-menu touch-position context-menu>
        <q-list style="min-width: 100px">
          <q-item v-if="allowPickUp === true" clickable @click="$emit('pickUpCard', {cardId: uuid})"  v-close-popup>
            <q-item-section avatar>
              <q-icon color="primary" name="pan_tool" />
            </q-item-section>
            <q-item-section>{{$t('card.pick_up')}}</q-item-section>
          </q-item>
          <q-item clickable :disable="!isValidUrl(externalLink)" @click="openExternalLink"  v-close-popup>
            <q-item-section side>
              <q-icon name="open_in_new" />
            </q-item-section>
            <q-item-section>{{$t('nav.visit_link')}}</q-item-section>
          </q-item>
          <q-item clickable @click="createCopyInCollection"  v-close-popup>
            <q-item-section side>
              <q-icon name="drive_file_move" />
            </q-item-section>
            <q-item-section>{{$t('card.copy_to_collection')}}</q-item-section>
          </q-item>
          <q-item clickable v-if="allowEdit" @click="viewMode = 'edit';editFormVisible = true" v-close-popup>
            <q-item-section side>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>{{$t('base.edit')}}</q-item-section>
          </q-item>
          <q-item clickable v-if="allowSetChange === true && setOptions && setOptions.length > 0">
            <q-item-section side>
              <q-icon name="drive_file_move" />
            </q-item-section>
            <q-item-section>{{$t('card.change_cardset')}}</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>
            <q-menu anchor="top end" self="top start">
              <q-item :clickable="set.value !== cardset" @click="$emit('setChanged', {'newSet': set.value, 'cardId': uuid})" v-for="set in setOptions" :key="set.value" v-close-popup>
                <q-item-section>
                  {{ set.label }}
                </q-item-section>
                <q-item-section side>
                  <q-avatar>
                    <q-img :src="set['checked-icon']" />
                  </q-avatar>
                </q-item-section>
                <q-item-section v-if="set.value === cardset" side>
                  <q-icon name="check" color="positive" />
                </q-item-section>
              </q-item>
            </q-menu>
          </q-item>
          <q-item clickable v-if="allowDelete" @click="deleteDialogVisible = true" v-close-popup>
            <q-item-section side>
              <q-icon name="delete" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative">{{$t('base.delete')}}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-card>
    <div v-for="(cardId) in addonsBot" :key="cardId" class="row items-start q-gutter-xs">
      <fola-card-addon :card-id="cardId" @addonEditSubmitted="(config) => $emit('cardEditSubmitted', config)" @addonPickedUp="handlePluginRemove($event, cardId)" />
    </div>
    

    <q-dialog v-model="editFormVisible" @hide="$emit('editorClosed')">
      <q-card class="edit-dialog">
        <q-form @submit="submitCardForm">
          <q-card-section class="row justify-center"> 
            <q-select
              filled
              v-model="editorTypeModel"
              :options="typeOptions"
              stack-label
              label=""
              class="col-6"
            >
              <template v-slot:selected>
                <q-icon :name="getTypeIconName(editorTypeModel.value)" size="md" :color="getTypeColor(editorTypeModel.value)" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" :color="getTypeColor(scope.opt.value)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-separator />

          <q-card-section class="text-center">
            <q-input v-model="editorCardName" filled label="" :rules="nameRules" />
            <span class="text-start">
              {{$t('validation.curr_length', {"curr": editorCardName.length, "max": nameMaxLength})}}
            </span>
            <q-input v-model="editorExtUrl" filled :label="$t('card.external_link')" :rules="extUrlRules" />
          </q-card-section>
          <q-card-section v-if="editorTypeModel.value === 'interaction'" class="row justify-center">
            <q-select
              filled
              v-model="subjectLeftModel"
              :options="interactionSubjectOptions"
              stack-label
              label=""
              class="col-4"
            >
              <template v-slot:selected>
                <q-icon :name="getInteractionSubjectIconName(subjectLeftModel.value)" size="md" color="primary" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" color="primary" />
                  </q-item-section>
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              filled
              v-model="interactionDirectionModel"
              :options="interactionDirectionOptions"
              stack-label
              label=""
              class="col-4"
            >
              <template v-slot:selected>
                <q-icon :name="getDirectionIconName(interactionDirectionModel.value)" size="md" color="primary" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" color="primary" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              filled
              v-model="subjectRightModel"
              :options="interactionSubjectOptions"
              stack-label
              label=""
              class="col-4"
            >
              <template v-slot:selected>
                <q-icon :name="getInteractionSubjectIconName(subjectRightModel.value)" size="md" color="primary" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" color="primary" />
                  </q-item-section>
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>


          <q-card-section v-else>
            <q-input v-model="editorImgUrl" filled :label="$t('card.image_url')" :rules="imageUrlRules" />
            <q-img v-if="isImageUrl(editorImgUrl)" class="card-image" :src="editorImgUrl" :ratio="4/3" />
          </q-card-section>

          <q-separator />

        
          <q-card-section class="scroll">
            <q-input v-model="editorCardDescription" filled type="textarea" :rules="descriptionRules"/>
            <span>
              {{$t('validation.curr_length', {"curr": editorCardDescription.length, "max": descriptionMaxLength})}}
            </span>
          </q-card-section>

          <q-separator />

 
          <q-card-actions align="around">
            <q-btn flat :label="viewMode === 'create' ? $t('base.create') : $t('base.save')" :aria-label="viewMode === 'create' ? $t('base.create') : $t('base.save')" :disable="!isFormValid" color="primary" type="submit" />
            <q-btn flat :label="$t('base.cancel')" :aria-label="$t('base.cancel')" color="primary" type="reset" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialogVisible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{$t('card.delete_card_confirm', {cardname: name})}}</span>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat :label="$t('base.cancel')" color="primary" v-close-popup />
          <q-btn flat :label="$t('base.delete')" color="primary" @click="this.$emit('cardDeleted', uuid)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import FolaCardAddon from '@/components/FolaCardAddon.vue';
import { defineComponent } from 'vue'
export default defineComponent ({
  name: "FolaCard",

  components: {
    FolaCardAddon
  },
  props: ['uuid', 'cardset', 'allowSetChange', 'allowEdit', 'allowDelete', 'addonsTop', 'addonsBot', 'allowPickUp', 'name', 'description', 'type', 'externalLink', 'imageUrl', 'interactionSubjectLeft', 'interactionSubjectRight', 'interactionDirection', 'mode', 'allowDrag', 'setOptions'],
  emits: ['dragstart', 'cardEditSubmitted', 'cardCreateSubmitted', 'addonRemoved', 'cardDeleted', 'pickUpCard', 'editorClosed', 'setUpdated'],
  data() {
    return {
      deleteDialogVisible: false,
      activeDrag: null,
      cardUuid: this.uuid,
      pluginsTop: this.type === 'interaction' ? this.addonsTop : [],
      pluginsBot: this.type === 'interaction' ? this.addonsBot : [],
      cardName: this.name,
      editorCardName: this.name,
      nameMinLength: 10,
      nameMaxLength: 128,
      descriptionMinLength: 10,
      descriptionMaxLength: 256,
      cardDescription: this.description,
      editorCardDescription: this.description,
      extUrl: this.externalLink,
      editorExtUrl: this.externalLink || '',
      imgUrl: this.imageUrl,
      editorImgUrl: this.imageUrl || '',
      cardType: this.type || 'interaction',
      viewMode: this.mode || 'view',
      editFormVisible: this.mode === 'edit' || this.mode === 'create',
      editorTypeModel: {
          label:'',
          icon: this.getTypeIconName(this.type || 'interaction'),
          value: this.type || 'interaction'
      },
      isDraggable: this.allowDrag || false,
      typeOptions: [
        {
          label:'Interaction',
          icon: this.getTypeIconName('interaction'),
          value: 'interaction'
        },
        {
          label:'Learning Enhancing Technology',
          icon: this.getTypeIconName('LET'),
          value: 'LET'
        },
        {
          label:'What do we want to know?',
          icon: this.getTypeIconName('what'),
          value: 'what'
        }
      ],
      interactionDirectionModel: {
          label:'',
          icon: this.getTypeIconName(this.interactionDirection || 'both'),
          value: this.interactionDirection || 'both'
      },
      interactionDirectionOptions: [
        {
          label:'',
          icon: this.getDirectionIconName('leftToRight'),
          value: 'leftToRight'
        },
        {
          label:'',
          icon: this.getDirectionIconName('rightToLeft'),
          value: 'rightToLeft'
        },
        {
          label:'',
          icon: this.getDirectionIconName('both'),
          value: 'both'
        }
      ],
      subjectLeftModel: {
          label:'',
          icon: this.getInteractionSubjectIconName(this.interactionSubjectLeft || 'student'),
          value: this.interactionSubjectLeft || 'student'
      },
      subjectRightModel: {
          label:'',
          icon: this.getInteractionSubjectIconName(this.interactionSubjectRight || 'material'),
          value: this.interactionSubjectRight || 'material'
      },
      interactionSubjectOptions: [
        {
          label: this.$t('card.subject_teacher'),
          icon: this.getInteractionSubjectIconName('teacher'),
          value: 'teacher'
        },
        {
          label: this.$t('card.subject_learner'),
          icon: this.getInteractionSubjectIconName('student'),
          value: 'student'
        },
        {
          label: this.$t('card.subject_material'),
          icon: this.getInteractionSubjectIconName('material'),
          value: 'material'
        }
      ]
    }
  },
  computed: {
    ...mapState('activeBoard', ['cards']),
    getViewConfig: function () {

      return {
        "uuid": this.uuid,
        "name": this.name,
        "description": this.cardDescription,
        ...this.isValidUrl(this.externalLink) && { "externalLink": this.externalLink },
        ...this.isImageUrl(this.imageUrl) && { "imageUrl": this.imageUrl },
        "type": this.type,
        "interactionSubjectLeft": this.interactionSubjectLeft,
        "interactionSubjectRight": this.interactionSubjectRight,
        "interactionDirection": this.interactionDirection,
        "addonsTop": this.addonsTop,
        "addonsBot": this.addonsBot
      }
    },
    getEditConfig: function () {
      return {
        "uuid": this.uuid,
        "name": this.editorCardName,
        "description": this.editorCardDescription,
        ...this.isValidUrl(this.editorExtUrl) && { "externalLink": this.editorExtUrl },
        ...this.isImageUrl(this.editorImgUrl) && { "imageUrl": this.editorImgUrl },
        "cardType": this.editorTypeModel.value,
        "interactionSubjectLeft": this.subjectLeftModel.value,
        "interactionSubjectRight": this.subjectRightModel.value,
        "interactionDirection": this.interactionDirectionModel.value
      }
    },
    canChangeSet: function() {
      return this.userHasPermission()('API:CARDS:MANAGE')
    },
    descriptionRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.descriptionMinLength) || this.$i18n.t('validation.min_length', {"min": this.descriptionMinLength}),
      val => (val.length <= this.descriptionMaxLength) || this.$i18n.t('validation.max_length', {"max": this.descriptionMaxLength  }),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    nameRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.nameMinLength) || this.$i18n.t('validation.min_length', {"min": this.nameMinLength}),
      val => (val.length <= this.nameMaxLength) || this.$i18n.t('validation.max_length', {"max": this.nameMaxLength}),
      val => !this.containsSpecialCharacters(val) || this.$i18n.t('validation.no_special_characters')
    ]},
    extUrlRules: function () {
      return [
        val => (this.isValidUrl(val) || val === '') || this.$i18n.t('validation.invalid_url')
      ]
    },
    imageUrlRules: function () {
      return [
        val => (this.isImageUrl(val) || val === '') || this.$i18n.t('validation.invalid_url')
      ]
    },
    isFormValid: function () {
      return this.editorCardName.length >= this.nameMinLength && this.editorCardName.length <= this.nameMaxLength 
      && this.editorCardDescription.length >= this.descriptionMinLength && this.editorCardDescription.length <= this.descriptionMaxLength
      && !this.containsSpecialCharacters(this.editorCardName) && !this.containsSpecialCharacters(this.editorCardDescription)
      && (this.editorExtUrl === '' || this.isValidUrl(this.editorExtUrl))
      && (this.editorImgUrl === '' || this.isImageUrl(this.editorImgUrl))
    }
  },
  methods: {
    ...mapActions('activeBoard', ['getCardByUuid']),
    ...mapActions('cards', ['createCard']),
    ...mapActions('alert', ['setAlert']),
    openExternalLink: function (val){
      if(this.externalLink){
          window.open(this.externalLink , '_blank')
      }
    },
    createCopyInCollection: async function () {
      const config = this.getViewConfig
      await this.createCard({card: config})
      this.setAlert({
        type: 'positive',
        visible: true,
        message: this.$i18n.t('card.confirm_copy'),
      })
    },
    handleDragStart: function (event, cardId) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('cardId', cardId)
      this.$emit("dragstart", event)
    },
    submitCardForm: function (event, val) {
      const config = this.getEditConfig
      if(this.viewMode === 'edit'){
        this.$emit('cardEditSubmitted', config)
      }else{
        this.$emit('cardCreateSubmitted', config)
      }
      this.viewMode = 'view'
      this.editFormVisible = false
    },

    handlePluginRemove: function (event, cardId ){
      this.$emit("addonRemoved", {"hostCardId": this.uuid, "addonId": cardId})
    },
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
    },
    isValidUrl (val){
      return /^(ftp|http|https):\/\/[^ "]+$/.test(val)
    },
    isImageUrl(val){
      return this.isValidUrl(val) && (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(val)
    },
    getTypeIconName (type) {
      switch (type) {
        case 'interaction':
          return 'offline_bolt'
        case 'LET':
          return 'memory'
        case 'what':
          return 'help'
        default:
          return 'style'
      }
    },
    getTypeColor (type) {
      switch (type) {
        case 'interaction':
          return 'primary'
        case 'LET':
          return 'accent'
        case 'what':
          return 'orange'
        default:
          return 'black'
      }
    },
    getDirectionIconName (direction) {
      switch (direction) {
        case 'leftToRight':
          return 'east'
        case 'rightToLeft':
          return 'west'
        default:
          return 'sync_alt'
      }
    },
    getInteractionSubjectIconName (interactionSubject) {
      switch (interactionSubject) {
        case 'student':
          return 'school'
        case 'material':
          return 'local_library'
        case 'teacher':
          return 'person'
        default:
          return 'style'
      }
    },
  },

});
</script>
<style scoped>
.card:hover {
    cursor: pointer;
}

.card-view {
  width: 200px;
  max-width: 50vw;
}

.plugin-chip {
  width: 200px;
  max-width: 50vw;
}

.image-placeholder {
  width: 160px;
  height: 120px;
  border-style: solid;
  border-color: grey;
}

.edit-dialog {
  width: 300px;
  max-width: 80vw;
}
</style>
