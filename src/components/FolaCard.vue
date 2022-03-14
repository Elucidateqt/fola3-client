<template>
    <q-card @click="openExternalLink" class="card-view" :draggable="isDraggable" @dragstart="handleDragStart($event, getCurrentConfig)">
        <q-card-section class="text-center">
          {{cardName}}
        </q-card-section>
      <q-separator />
      <q-card-section v-if="typeModel.value === 'interaction'" class="row justify-around">
        <q-icon class="col-4" :name="getInteractionSubjectIconName(subjectLeftModel.value)" size="md" color="primary" />
        <q-icon class="col-4" :name="getDirectionIconName(interactionDirectionModel.value)" size="md" color="primary" />
        <q-icon class="col-4" :name="getInteractionSubjectIconName(subjectRightModel.value)" size="md" color="primary" />
      </q-card-section>
      <q-card-section v-else>
        <q-img :src="imgUrl" />
      </q-card-section>
      <q-card-section>
          {{ cardDescription }}
        </q-card-section>
      <q-separator />
        <q-card-section class="text-center">
          <q-icon :name="getTypeIconName(typeModel.value)" size="md" :color="getTypeColor(typeModel.value)" />
        </q-card-section>
    </q-card>
    

  <q-dialog v-model="isEditMode">
    <q-card class="edit-dialog" @click="viewMode='view'">
      <q-card-section class="text-center">
          <q-input v-model="cardName" filled label="" :rules="nameRules" />
          <q-input v-model="extUrl" filled :label="$t('card.external_link')" :rules="urlRules" />
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
          <q-input v-model="editorImgUrl" filled label="" :rules="urlRules" />
          <q-img class="card-image" :src="imgUrl"/>
      </q-card-section>
      <q-card-section class="row justify-center"> 

      <q-select
        filled
        v-model="typeModel"
        :options="typeOptions"
        stack-label
        label=""
        class="col-6"
        emit-value
        @updated="handleTypeSelection"      >
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
      

    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "FolaCard",

  components: {
    
  },
  props: ['uuid', 'name', 'description', 'type', 'externalLink', 'imageUrl', 'interactionSubjectLeft', 'interactionSubjectRight', 'interactionDirection', 'mode', 'allowDrag'],
  data() {
    return {
      // counter only uses this.initialCounter as the initial value;
      // it is disconnected from future prop updates.
      cardUuid: this.uuid,
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
      editorCardType: this.type,
      viewMode: this.mode || 'view',
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
    getCurrentConfig: function () {
      return {
        "uuid": this.uuid,
        "name": this.cardName,
        "description": this.cardDescription,
        "knowledbaseUrl": this.externalLink,
        "imageUrl": this.imgUrl,
        "cardType": this.type,
        "interactionSubjectLeft": this.interactionSubjectLeft,
        "interactionSubjectRight": this.interactionSubjectRight,
        "interactionDirection": this.interactionDirection
      }
    },
    descriptionRules: function () {
      return [
      val => (val !== null && val !== '') || '  ',
      val => (val.length >= this.descriptionMin) || this.$i18n.t('validation.min_length', {"min": this.descriptionMinLength}),
      val => (val.length <= this.descriptionMax) || this.$i18n.t('validation.max_length', {"max": this.descriptionMaxLength  }),
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
      return this.cardName.length >= this.nameMinLength && this.cardName.length <= this.nameMaxLength 
      && this.cardDescription.length >= this.descriptionMinLength && this.cardDescription.length <= this.descriptionMaxLength
      && !this.containsSpecialCharacters(this.cardName) && !this.containsSpecialCharacters(this.cardDescription)
    },
    isEditMode: function () {
      return this.viewMode === 'edit'
    }
  },
  methods: {
    openExternalLink: function (val){
      if(this.externalLink){
          window.open(this.externalLink , '_blank')
      }
    },
    handleTypeSelection: function (val){
      console.log("selected", val)
      this.editorCardType = val
    },
    handleDragStart: function (event, card) {
            event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('uuid', card.uuid)
      event.dataTransfer.setData('name', card.name)
      event.dataTransfer.setData('description', card.description),
              event.dataTransfer.setData('knowledgebaseUrl', card.knowledbaseUrl),
              event.dataTransfer.setData('imageUrl', card.imageUrl),
              event.dataTransfer.setData('cardType', card.cardType),
              event.dataTransfer.setData('interactionSubjectLeft', card.interactionSubjectLeft),
              event.dataTransfer.setData('interactionSubjectRight', card.interactionSubjectRight),
              event.dataTransfer.setData('interactionDirection', card.interactionDirection)
      console.log("dragstart", event)
      console.log(card)
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

.edit-dialog {
  width: 300px;
  max-width: 80vw;
}
</style>
