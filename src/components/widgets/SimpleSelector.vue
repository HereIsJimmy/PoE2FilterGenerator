<template>
  <div class="simple-select">
    <Multiselect
      :options="filteredItems"
      @select="itemSelected"
      @search-change="q => query = q"
      @deselect="itemRemoved"
      :mode="'single'"
      :value="lastSelection"
      :label="labelField"
      :trackBy="valueField"
      :placeholder="placeholder"
      :disabled="disabled"
      :internal-search="false"
      :searchable="allowSearch"
      :canDeselect="allowRemove"
      :canClear="allowRemove"
      :hideSelected="false"
      selectLabel=""
      :deselectLabel="'Click to deselect'"
      :class="{ 'hidden-overflow': !overflow }"
      :style="`--ms-max-height: ${height}px`"
      ref="selector"
    >
    </Multiselect>
  </div>
</template>

<script setup lang="ts">
import Multiselect from '@vueform/multiselect';
import { nextTick, computed, watch, ref, onMounted } from 'vue';
const emit = defineEmits(['changed', 'remove'])

interface IProps {
  current: any,
  options: Array<{ value: any, label: string }>,
  autoselect?: Boolean,
  height?: number,
  filter?: Function,
  placeholder?: string,
  disabled?: boolean,
  direction?: string,
  allowSearch?:  boolean,
  allowRemove?: boolean,
  valueField?: string,
  labelField?: string,
  searchFields?: Array<string>,
  overflow?: boolean,
}
const props = withDefaults(defineProps<IProps>(), {
  height: 600,
  valueField: 'value',
  labelField: 'label',
  searchFields: () => ['label', 'value'],
  overflow: true,
  allowRemove: false,
})

const selector = ref(null)
let query: string = ''
let lastSelection: any = props.current;

onMounted(async () => {
  await nextTick()
  initSelection(lastSelection)
  if (selector.value) {
    const input = selector.value.$el.getElementsByClassName('multiselect__input')[0] || null
    if (input) {
      input.autocomplete = false
    }
  }
})

const filteredItems = computed(() => {
  const val = formatValue(query || '')
  const filterFunctions: Array<Function> = [(it) => it]

  if (props.filter) {
    filterFunctions.push(props.filter)
  }

  // Input field searcher
  filterFunctions.push((it) => {
    if (query && props.searchFields) {
      return props.searchFields.some((field) => formatValue(it[field]).includes(val))
    }
    return it
  })

  return props.options.filter((it) => filterFunctions.every((f) => f(it)))
})

watch(() => props.current, (newV, oldV) => {
  if (lastSelection === newV)
    return

  lastSelection = null
  selectItem(newV, true)
})
watch(() => props.options, (newV, oldV) => {
  const curr = lastSelection
  lastSelection = null
  initSelection(curr)
})

function optionLabel(it) {
  return it?.option[props.labelField]
}
function selectItem(value, dontEmit?) {
  lastSelection = filteredItems.value.find((it) => it[props.valueField] == value)?.[props.valueField]
  if (dontEmit) return
  if (lastSelection) emit('changed', lastSelection)
}
function initSelection(curr) {
  if (filteredItems.value.length && curr) {
    selectItem(curr)
  }
  if (!lastSelection && filteredItems.value.length === 1 && props.autoselect) {
    itemSelected(filteredItems.value?.[0]?.[props.valueField])
  }
  if (!lastSelection) {
    autoSelectItem()
  }
  if (curr && !lastSelection) {
    emit('changed', null)
  }
}
function autoSelectItem() {
  if (props.autoselect && filteredItems.value.length && !lastSelection) {
    itemSelected(filteredItems.value?.[0]?.[props.valueField])
  }
}
function itemSelected(val) {
  console.log(val)
  lastSelection = val
  emit('changed', lastSelection)
}
function formatValue(value) {
  if (value == null) return ''
  return value.toString().toLowerCase()
}

function itemRemoved() {
  if (props.allowRemove) {
    removeSelected()
  }
}
function removeSelected() {
  emit('remove', null)
  lastSelection = null
}

</script>


<style src="@vueform/multiselect/themes/default.css"></style>