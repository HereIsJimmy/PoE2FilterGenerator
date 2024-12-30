<template>
  <div v-if="folded">
    <div class="d-flex flex-row justify-content-between">
      <h3 class="mb-0 text-start pointer">
        <span @click="folded = false">+ {{ rule ? `${rule.name}` : 'New rule' }}</span>
      </h3>
      <h3 v-if="rule" class="text-end">
        <span
          class="order-button"
          :class="{ 'text-muted': !canMoveUp, pointer: canMoveUp }"
          @click="canMoveUp && emit('move-up')"
        >
          Up
        </span>
        -
        <span
          class="order-button"
          :class="{ 'text-muted': !canMoveDown, pointer: canMoveDown }"
          @click="canMoveDown && emit('move-down')"
        >
          Down
        </span>
      </h3>
    </div>
  </div>
  <div v-else>
    <div class="d-flex flex-row justify-content-between">
      <h3 class="mb-0 text-start pointer">
        <span @click="folded = true">- {{ rule ? `${rule.name}` : 'New rule' }}</span>
      </h3>
      <h3 v-if="rule" class="text-end">
        <span
          class="order-button"
          :class="{ 'text-muted': !canMoveUp, pointer: canMoveUp }"
          @click="canMoveUp && emit('move-up')"
        >
          Up
        </span>
        -
        <span
          class="order-button"
          :class="{ 'text-muted': !canMoveDown, pointer: canMoveDown }"
          @click="canMoveDown && emit('move-down')"
        >
          Down
        </span>
      </h3>
    </div>
    <div class="row mt-2">
      <div class="col-md-4">
        <h4 class="form-check-label text-start">
          1. Add bases
        </h4>

        <SimpleSelector 
          key="baseType"
          :current="baseTypeSelected"
          :options="baseTypeItems"
          placeholder="Select base type"
          @changed="v => baseTypeSelected = v"
        />
        <template v-if="baseTypeSelected === 'armours'">
          <MultiSelector
            key="armours"
            :current="selectedArmourTypes"
            :options="armourTypeItems"
            placeholder="Select armour type"
            class="mt-4"
            @changed="handleChangedArmourTypes"
          />
          <MultiSelector
            v-if="selectedArmourTypes"
            key="armour-slots"
            :current="selectedArmourPieces"
            :options="armourPieceItems"
            placeholder="Select armour piece"
            class="mt-4"
            @changed="handleChangedArmourPieces"
          />
        </template>
        <MultiSelector
          v-else-if="baseTypeSelected === 'weapons'"
          key="weapons"
          :current="selectedWeaponType"
          :options="weaponTypeItems"
          placeholder="Select weapon type"
          class="mt-4"
          @changed="handleChangedWeapons"
        />
        <MultiSelector
          v-else-if="baseTypeSelected === 'offHands'"
          key="offHands"
          :current="selectedOffhandTypes"
          :options="offHandTypeItems"
          placeholder="Select off-hand type"
          class="mt-4"
          @changed="handleChangedOffhands"
        />
        <MultiSelector
          v-else-if="baseTypeSelected === 'jewellery'"
          key="jewellery"
          :current="selectedJewelleryTypes"
          :options="jewelleryTypeItems"
          placeholder="Select jewellery type"
          class="mt-4"
          @changed="handleChangedJewellery"
        />
        <MultiSelector
          v-else-if="baseTypeSelected === 'others'"
          key="others"
          :current="selectedOtherTypes"
          :options="otherTypeItems"
          placeholder="Select other type"
          class="mt-4"
          @changed="handleChangedOthers"
        />
        <div class="form-check text-start d-flex align-items-center">
          <input type="checkbox" class="form-check-input me-2" :id="`expert-only${rule ? '-'+rule.id : ''}`" v-model="showExpertOnly">
          <label class="form-check-label w-100" :for="`expert-only${rule ? '-'+rule.id : ''}`">
            Expert only bases
          </label>
        </div>
        <MultiSelector
          v-if="showBaseSelector"
          key="bases"
          :current="currentBases"
          :options="baseItemsOfType"
          placeholder="Select base item"
          class="mt-4"
          @changed="handleChangedBases"
          @selected="addedBase"
          @removed="removedBase"
        />
        <div class="text-start" style="font-size: 0.7em">
          <span
            v-for="base in selectedBases"
            :key="base"
            class="selected-base"
            @click="removeBase(base)"
          >
            {{ base }}
          </span>
        </div>
        <MultiSelector
          v-if="hasRarity"
          key="rarities"
          :current="selectedRarities"
          :options="rarityItems"
          placeholder="Select rarities"
          class="mt-4"
          @changed="handleChangedRarity"
        />
      </div>

      <div class="col-md-8 text-start">
        
        <div class="form-check text-start d-flex align-items-center">
          <input type="checkbox" class="form-check-input me-2" :id="`show-rule${rule ? '-'+rule.id : ''}`" v-model="showItems">
          <label class="form-check-label w-100" :for="`show-rule${rule ? '-'+rule.id : ''}`">
            <h4 class="mb-0">2. Show</h4>
          </label>
        </div>
        <LootStyle
          v-if="showItems"
          :id="rule?.id"
          :style="ruleStyle"
          @changed="v => ruleStyle = v"
        />
        <div v-else>
          These items will be hidden
        </div>
      </div>
    </div>
    <div class="d-flex flex-row" style="gap: 1em">
      <button class="btn btn-success btn-lg mt-4" :class="{ 'w-50': rule, 'w-100': !rule }" type="button" @click="createRule">
        {{ rule ? 'Update rule' : 'Add rule' }}
      </button>
      <button v-if="rule" class="w-50 btn btn-danger btn-lg mt-4" type="button" @click="emit('remove')">
        Remove rule
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>

import SimpleSelector from './SimpleSelector.vue'
import MultiSelector from './MultiSelector.vue'
import LootStyle from './LootStyle.vue'
import {
  typesWithRarity,
  rarities,
  baseTypes,
  otherTypes,
  weaponTypes,
  armourTypes,
  armourPieces,
  offHandTypes,
  jewelleryTypes
} from "../../constants.js"

import ArmourBases from "../../assets/data/armour.json"
import WeaponBases from "../../assets/data/weapons.json"
import JewelleryBases from "../../assets/data/jewellery.json"
import OffhandBases from "../../assets/data/offhands.json"
import OtherItems from "../../assets/data/others.json"
import { Rule, Style } from '../../types'

import { computed, watch, ref, reactive } from 'vue';
import type { Ref } from 'vue';

const emit = defineEmits(['changed', 'created', 'move-up', 'move-down', 'remove'])
const props = defineProps<{
  canMoveUp: boolean,
  canMoveDown: boolean,
  rule?: Rule
}>();

const rarityItems = reactive(rarities)
const baseTypeItems = reactive(baseTypes)
const otherTypeItems = reactive(otherTypes)
const weaponTypeItems = reactive(weaponTypes)
const armourTypeItems = reactive(armourTypes)
const armourPieceItems = reactive(armourPieces)
const offHandTypeItems = reactive(offHandTypes)
const jewelleryTypeItems = reactive(jewelleryTypes)

const ruleName = ref(props.rule?.name || '')
const showItems = ref(true)
const folded = ref(!!props.rule)
const showExpertOnly = ref(true)
const baseTypeSelected: Ref<string> = ref('')
const selectedArmourTypes: Ref<Array<string>> = ref([])
const selectedArmourPieces: Ref<Array<string>> = ref([])
const selectedOffhandTypes: Ref<Array<string>> = ref([])
const selectedWeaponType: Ref<Array<string>> = ref([])
const selectedJewelleryTypes: Ref<Array<string>> = ref([])
const selectedOtherTypes: Ref<Array<string>> = ref([])

const selectedRarities: Ref<Array<string>> = ref([])
const currentBases: Ref<Array<string>> = ref([])
const selectedBases: Ref<Array<string>> = ref(props.rule?.items || [])
const ruleStyle = ref(props.rule?.style)

const hasRarity = computed(() =>
  baseTypeSelected.value === 'others'
    ? selectedOtherTypes.value.every(type => typesWithRarity.includes(type))
    : typesWithRarity.includes(baseTypeSelected.value)
)
const baseItemsOfType = computed(() => {
  let arr: Array<string> = []
  switch (baseTypeSelected.value) {
    case 'armours':
      arr = selectedArmourPieces.value.flatMap(slot => 
        selectedArmourTypes.value.flatMap(type => ArmourBases[slot][type])
      )
      break;
    case 'offHands':
      arr = selectedOffhandTypes.value.flatMap(type => 
        OffhandBases[type]
      )
      break;
    case 'weapons':
      arr = selectedWeaponType.value.flatMap(type => 
        WeaponBases[type]
      )
      break;
    case 'jewellery':
      arr = selectedJewelleryTypes.value.flatMap(type => 
        JewelleryBases[type]
      )
      break;
    case 'others':
      arr = selectedOtherTypes.value.flatMap(type => 
        OtherItems[type]
      )
      break;
  }

  const filtered = showExpertOnly.value
    ? (arr.some(it => it.includes('Expert ')) && arr.filter(it => it.includes('Expert ')) || arr)
    : arr
  const mapped: Array<{ label: string, value: string }> = filtered.map(value => ({ label: value, value }))
  return mapped
});

const showBaseSelector = computed(() => {
  const bt = baseTypeSelected.value
  return (
    bt === 'armours' && !!selectedArmourTypes.value?.length && !!selectedArmourPieces.value?.length ||
    bt === 'offHands' && !!selectedOffhandTypes.value?.length ||
    bt === 'weapons' && !!selectedWeaponType.value?.length ||
    bt === 'jewellery' && !!selectedJewelleryTypes.value?.length ||
    bt === 'others' && !!selectedOtherTypes.value?.length ||
    false
  )
});

watch(selectedBases, (newV) => console.log(newV))
function handleChangedItems (field, v) {
  console.log(field, v)
  field.value.splice(0, field.value.length, ...v)
}
function handleChangedArmourTypes(v) {
  handleChangedItems(selectedArmourTypes, v)
}
function handleChangedArmourPieces(v) {
  handleChangedItems(selectedArmourPieces, v)
}
function handleChangedWeapons(v) {
  handleChangedItems(selectedWeaponType, v)
}
function handleChangedOffhands(v) {
  handleChangedItems(selectedOffhandTypes, v)
}
function handleChangedJewellery(v) {
  handleChangedItems(selectedJewelleryTypes, v)
}
function handleChangedOthers(v) {
  handleChangedItems(selectedOtherTypes, v)
}
function handleChangedRarity(v) {
  handleChangedItems(selectedRarities, v)
}
function handleChangedBases(v) {
  handleChangedItems(currentBases, v)
}
function addedBase(v) {
  console.log(v)
  if (selectedBases.value.includes(v))
    return

  selectedBases.value.push(v)
}
function removedBase(v) {
  console.log(v)
  if (!selectedBases.value.includes(v))
    return
  const i = selectedBases.value.indexOf(v)
  selectedBases.value.splice(i, 1)
}
function removeBase(v) {
  const i = selectedBases.value.indexOf(v)
  selectedBases.value.splice(i, 1)
  const currI = currentBases.value.indexOf(v)
  if (~currI) {
    currentBases.value.splice(currI, 1)
  }
}
function createRule() {
  emit('created', {
    name: ruleName,
    hide: !showItems.value,
    items: [...selectedBases.value],  
    style: {...ruleStyle.value},
  })
  
  selectedArmourTypes.value.splice(0, selectedArmourTypes.value.length)
  selectedArmourPieces.value.splice(0, selectedArmourPieces.value.length)
  selectedOffhandTypes.value.splice(0, selectedOffhandTypes.value.length)
  selectedWeaponType.value.splice(0, selectedWeaponType.value.length)
  selectedJewelleryTypes.value.splice(0, selectedJewelleryTypes.value.length)
  selectedOtherTypes.value.splice(0, selectedOtherTypes.value.length)
  selectedRarities.value.splice(0, selectedRarities.value.length)

  selectedBases.value.splice(0, selectedBases.value.length)
  currentBases.value.splice(0, currentBases.value.length)
}

</script>
<style scoped lang="scss">
.selected-base {
  color: #666;
  cursor: pointer;
  user-select: none;
  &:not(:last-child)::after {
    content: ', ';
  }
  &:hover {
    color: black;
  }
}
</style>