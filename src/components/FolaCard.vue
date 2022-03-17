<template>
<div>
  <div  v-for="(plugin, index) in addonsTop" :key="plugin.uuid" class="row items-start q-gutter-xs">
<q-chip square removable @remove="handlePluginRemove($event, 'addonsTop', index)" text-color="white" :color="getTypeColor(plugin.cardType)" class="plugin-chip col-12" :icon="getTypeIconName(plugin.cardType)" draggable @dragstart="handleDragStart($event, plugin)">{{plugin.name}}</q-chip>
  </div>
  <q-card class="card-view" :draggable="isDraggable" @dragstart="handleDragStart($event, getViewConfig)" @dragleave="activeDrag = null">
    <q-card-section class="text-center">
      {{name}}
    </q-card-section>
    <q-separator />
    <q-card-section v-if="typeModel.value === 'interaction'" class="row justify-around">
      <q-icon class="col-4" :name="getInteractionSubjectIconName(subjectLeftModel.value)" size="md" color="primary" />
      <q-icon class="col-4" :name="getDirectionIconName(interactionDirectionModel.value)" size="md" color="primary" />
      <q-icon class="col-4" :name="getInteractionSubjectIconName(subjectRightModel.value)" size="md" color="primary" />
    </q-card-section>
    <q-card-section v-else>
      <q-img :src="imageUrl" />
    </q-card-section>
    <q-card-section>
      {{ description }}
    </q-card-section>
    <q-separator />
    <q-card-section class="text-center">
      <q-icon :name="getTypeIconName(typeModel.value)" size="md" :color="getTypeColor(typeModel.value)" />
    </q-card-section>
    <q-menu touch-position>
      <q-list style="min-width: 100px">
        <q-item v-if="allowPickUp === true" clickable @click="$emit('pickUpCard', {card: this.getViewConfig})"  v-close-popup>
          <q-item-section>{{$t('card.pick_up')}}</q-item-section>
                  <q-item-section avatar>
          <q-icon color="primary" name="pan_tool" />
        </q-item-section>
        </q-item>
        <q-item clickable @click="openExternalLink"  v-close-popup>
          <q-item-section>{{$t('nav.visit_link')}}</q-item-section>
        </q-item>
        <q-item clickable @click="viewMode = 'edit';editFormVisible = true" v-close-popup>
          <q-item-section>{{$t('base.edit')}}</q-item-section>
        </q-item>
        <q-item clickable @click="this.$emit('deleteCard', uuid)" v-close-popup>
          <q-item-section>{{$t('base.delete')}}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-card>
    <div  v-for="(plugin, index) in addonsBot" :key="plugin.uuid" class="row items-start q-gutter-xs">
<q-chip removable @remove="handlePluginRemove($event, 'addonsBot', index)" square text-color="white" :color="getTypeColor(plugin.cardType)" class="plugin-chip col-12" :icon="getTypeIconName(plugin.cardType)" draggable @dragstart="handleDragStart($event, plugin)">{{plugin.name}}</q-chip>
  </div>
    

  <q-dialog v-model="editFormVisible">
    <q-card class="edit-dialog">
      <q-form ref="reportForm" @submit.prevent="submitCardForm">
        <q-card-section class="text-center">
          <q-input v-model="editorCardName" filled label="" :rules="nameRules" />
          <span class="text-start">
            {{$t('validation.curr_length', {"curr": editorCardName.length, "max": nameMaxLength})}}
          </span>
          <q-input v-model="editorExtUrl" filled :label="$t('card.external_link')" />
        </q-card-section>
        <q-card-section v-if="typeModel.value === 'interaction'" class="row justify-center">
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
              </q-item>
            </template>
          </q-select>
        </q-card-section>


        <q-card-section v-else>
          <q-input v-model="editorImgUrl" filled label="" />
          <q-img class="card-image" :src="editorImgUrl"/>
        </q-card-section>

        <q-separator />

        
        <q-card-section class="scroll">
          <q-input v-model="editorCardDescription" filled type="textarea" :rules="descriptionRules"/>
          <span>
            {{$t('validation.curr_length', {"curr": editorCardDescription.length, "max": descriptionMaxLength})}}
          </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="row justify-center"> 
          <q-select
            filled
            v-model="typeModel"
            :options="typeOptions"
            stack-label
            label=""
            class="col-6"
             >
            <template v-slot:selected>
              <q-icon :name="getTypeIconName(typeModel.value)" size="md" :color="getTypeColor(typeModel.value)" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" :color="getTypeColor(scope.opt.value)" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn flat :label="viewMode === 'create' ? $t('base.create') : $t('base.save')" :aria-label="viewMode === 'create' ? $t('base.create') : $t('base.save')" :disable="!isFormValid" color="primary" type="submit" v-close-popup />
          <q-btn flat :label="$t('base.cancel')" :aria-label="$t('base.cancel')" color="primary" type="reset" v-close-popup />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
export default {
  name: "FolaCard",

  components: {
    
  },
  props: ['uuid', 'addonsTop', 'addonsBot', 'allowPickUp', 'name', 'description', 'type', 'externalLink', 'imageUrl', 'interactionSubjectLeft', 'interactionSubjectRight', 'interactionDirection', 'mode', 'allowDrag'],
  emits: ['dragstart', 'cardEditSubmitted', 'cardCreateSubmitted', 'addonRemoved', 'deleteCard', 'pickUpCard'],
  data() {
    //TODO: use properties directly in view mode and internal edit models in edit mode template
    return {
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
      editorExtUrl: this.externalLink,
      imgUrl: this.imageUrl,
      editorImgUrl: this.imageUrl,
      cardType: this.type || 'interaction',
      viewMode: this.mode || 'view',
      editFormVisible: this.mode === 'edit' || this.mode === 'create',
      typeModel: {
          label:'',
          icon: this.getTypeIconName(this.type || 'interaction'),
          value: this.type || 'interaction'
      },
      isDraggable: this.allowDrag || false,
      typeOptions: [
        {
          label:'',
          icon: this.getTypeIconName('interaction'),
          value: 'interaction'
        },
        {
          label:'',
          icon: this.getTypeIconName('LET'),
          value: 'LET'
        },
        {
          label:'',
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
          label:'',
          icon: this.getInteractionSubjectIconName('teacher'),
          value: 'teacher'
        },
        {
          label:'',
          icon: this.getInteractionSubjectIconName('student'),
          value: 'student'
        },
        {
          label:'',
          icon: this.getInteractionSubjectIconName('material'),
          value: 'material'
        }
      ]
    }
  },
  computed: {
    getViewConfig: function () {
      return {
        "uuid": this.uuid,
        "name": this.cardName,
        "description": this.cardDescription,
        "knowledbaseUrl": this.externalLink,
        "imageUrl": this.imgUrl,
        "cardType": this.type,
        "interactionSubjectLeft": this.interactionSubjectLeft,
        "interactionSubjectRight": this.interactionSubjectRight,
        "interactionDirection": this.interactionDirection,
        "addonsTop": this.pluginsTop,
        "addonsBot": this.pluginsBot
      }
    },
    getEditConfig: function () {
      return {
        "uuid": this.uuid,
        "name": this.editorCardName,
        "description": this.editorCardDescription,
        "knowledbaseUrl": this.editorExtUrl,
        "imageUrl": this.editorImgUrl,
        "cardType": this.typeModel.value,
        "interactionSubjectLeft": this.subjectLeftModel.value,
        "interactionSubjectRight": this.subjectRightModel.value,
        "interactionDirection": this.interactionDirectionModel.value
      }
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
    isFormValid: function () {
      return this.editorCardName.length >= this.nameMinLength && this.editorCardName.length <= this.nameMaxLength 
      && this.editorCardDescription.length >= this.descriptionMinLength && this.editorCardDescription.length <= this.descriptionMaxLength
      && !this.containsSpecialCharacters(this.editorCardName) && !this.containsSpecialCharacters(this.editorCardDescription)
    }
  },
  methods: {
    openExternalLink: function (val){
      if(this.externalLink){
          window.open(this.externalLink , '_blank')
      }
    },
    handleDragStart: function (event, card) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('card', JSON.stringify(card))
      this.$emit("dragstart", event)
    },
    handleDragEnter: function (event) {
      const card = JSON.parse(e.dataTransfer.getData('card'))
      this.activeDrag = card
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
    getAddonConfig: function (container, index) {
      return {
        "uuid": this[container][index].uuid,
        "name": this[container][index].name,
        "description": this[container][index].description,
        "knowledbaseUrl": this[container][index].knowledbaseUrl,
        "imageUrl": this[container][index].imageUrl,
        "cardType": this[container][index].cardType,
        "interactionSubjectLeft": this[container][index].interactionSubjectLeft,
        "interactionSubjectRight": this[container][index].interactionSubjectRight,
        "interactionDirection": this[container][index].interactionDirection
      }
    },
    handlePluginRemove: function (event, container, index ){
      const config = this.getViewConfig
      const plugin = this.getAddonConfig(container, index)
      config[container].splice(index, 1)
      this.$emit("addonRemoved", {"addon": plugin, "newConfig": config, "origin": container})
    },
    containsSpecialCharacters: function (val){
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val)
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

};
</script>
<style scoped>
.card:hover {
    cursor: pointer;
}

.card-view {
  width: 200px;
  max-width: 50vw;
  height: 200px;
  max-height: 40vh;
  overflow-y: scroll;
}

.plugin-chip {
  width: 200px;
  max-width: 50vw;
}

.edit-dialog {
  width: 300px;
  max-width: 80vw;
}
</style>
