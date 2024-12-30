
<template>
  <div>
    <h2 class="mb-3">Creating Filter</h2>
    <form class="needs-validation was-validated" novalidate>
      <div class="row  justify-content-center g-3">
        <div class="justify-content-center col-sm-4">
          <label for="filterName" class="form-label">Filter name</label>
          <input type="text" class="form-control" id="filterName" placeholder="GmeeFilter" v-model="filterName" required>
          <div class="invalid-feedback">
            Filter name is required.
          </div>
        </div>
      </div>
      <hr class="my-4">
      
      <Rule @created="createRule" :can-move-down="false" :can-move-up="false" />

      <hr class="my-4">
      <h3>Added Rules</h3>

      <Rule
        v-for="(rule, i) in sortedRules"
        :key="rule.id"
        :rule="rule"
        :can-move-up="i > 0"
        :can-move-down="i < sortedRules.length - 1"
        class="mt-4"
        @edited="updateRule"
        @move-up="moveUpRule(rule)"
        @move-down="moveDownRule(rule)"
      />

      <hr class="my-4">

      <button class="w-100 btn btn-primary btn-lg" type="button" @click="createFilter">
        Create filter
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "../store/filter"
import Rule from "./widgets/Rule.vue"
import { colorHexToPoE } from '../utils'

import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia';
import { v4 as uuid } from 'uuid'
// import Draggable from 'vuedraggable'

const store = useFilterStore()
const { rules } = storeToRefs(store);
const filterName: Ref<string> = ref('')

const sortedRules = computed(() => {
  console.log(rules.value.sort((a, b) => a.order - b.order))
  return rules.value.sort((a, b) => a.order - b.order)
})
function createRule(rule) {
  store.addRule({
    id: uuid(),
    ...rule,
    order: rules.value.length
  })
}
function updateRule(rule) {
  store.updateRule(rule)
}
function moveUpRule(rule) {
  store.moveUpRule(rule)
}
function moveDownRule(rule) {
  store.moveDownRule(rule)
}

function saveData(data, fileName) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  const blob = new Blob(data, { type: "text/plain" })
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove()
}

function createFilter() {
  const data = createFilterTextFromRules(rules.value)
  saveData(data, filterName.value + '.filter')
}
function createFilterTextFromRules(rls) {
  return rls.map(({ hide, items, style, name }) => {
    if (hide) return 'Hide\n'

    let text = `Show #${name}\n`
    if (items.length)
      text += `\tBaseType == ${items.map(it => `"${it}"`).join(' ')}\n`
    if (style.rarities?.length)
      text += `\tRarity ${style.rarities.join(' ')}\n`
    if (style.borderColor) {
      console.log(style.borderColor, colorHexToPoE(style.borderColor))
      text += `\tSetBorderColor ${colorHexToPoE(style.borderColor)}\n`
    }
    if (style.backgroundColor)
      text += `\tSetBackgroundColor ${colorHexToPoE(style.backgroundColor)}\n`
    if (style.textColor)
      text += `\tSetTextColor ${colorHexToPoE(style.textColor)}\n`
    if (style.fontSize)
      text += `\tSetFontSize ${style.fontSize}\n`
    if (style.areaLevel && style.areaLevel.op !== 'any') {
      if (style.areaLevel.op === 'range') {
        text += `\tAreaLevel >= ${style.areaLevel.min}\n`
        text += `\tAreaLevel <= ${style.areaLevel.max}\n`
      } else {
        text += `\tAreaLevel ${style.areaLevel.op} ${style.areaLevel.min}\n`
      }
    }
    if (style.iconEnabled) 
      text += `\tMinimapIcon ${style.iconSize} ${style.iconColor} ${style.iconShape}\n`
    if (style.beamEnabled) 
      text += `\tPlayEffect ${style.beamColor}${style.beamTemporary ? ' Temp' : ''}\n`
    if (style.soundEnabled) 
      text += style.soundType === 'Custom'
        ? `\tCustomAlertSound ${style.soundFile} ${style.soundVolume}\n`
        : style.soundType === 'Positional'
          ? `\tPlayAlertSoundPositional ${style.soundFile} ${style.soundVolume}\n`
          : `\tPlayAlertSound ${style.soundFile} ${style.soundVolume}\n`
    
    return text
  })
}

/*
const arr = {}
for (el of temp1.querySelectorAll("& > .col > div > div:nth-child(2) > a").values()) {
    arr[`"${el.innerHTML}"`] = ''
}
console.table(arr)
*/

</script>

<style>
.multiselect-height {
  height: 42px;
}
.pointer {
  cursor: pointer;
}
</style>