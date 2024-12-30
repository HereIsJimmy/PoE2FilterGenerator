<template>
  <div class="simple-select">
    <Multiselect
      :options="filteredItems"
      @select="itemSelected"
      @search-change="q => query = q"
      @deselect="itemRemoved"
      :mode="'multiple'"
      :value="lastSelection"
      :label="labelField"
      :trackBy="valueField"
      :placeholder="placeholder"
      :disabled="disabled"
      :internal-search="false"
      :searchable="allowSearch"
      :clearOnSelect="false"
      :closeOnSelect="false"
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
const emit = defineEmits(['changed', 'removed', 'selected'])

interface IProps {
  current: any,
  options: Array<{ value: any, label: string }>,
  autoselect?: boolean,
  height?: number,
  filter?: Function,
  placeholder?: string,
  disabled?: boolean,
  direction?: string,
  allowSearch?:  boolean,
  valueField?: string,
  labelField?: string,
  searchFields?: Array<string>,
  overflow?: boolean,
  notReactToOutside?: boolean,
}
const props = withDefaults(defineProps<IProps>(), {
  height: 600,
  valueField: 'value',
  labelField: 'label',
  searchFields: () => ['label', 'value'],
  overflow: true,
  notReactToOutside: false,
})

const selector = ref(null)
let query: string = ''
let lastSelection: Array<any> = props.current;

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
  if (props.notReactToOutside)
  if (lastSelection.every(it => newV.includes(it)))
    return
  console.log('current', newV)
  lastSelection.splice(0, lastSelection.length)
  selectItem(newV, true)
})
watch(() => props.options, (newV, oldV) => {
  const curr = [...lastSelection]
  console.log('options1', newV)
  console.log('options2', curr)
  lastSelection.splice(0, lastSelection.length)
  initSelection(curr)
})

function selectItem(values, dontEmit?) {
  lastSelection = filteredItems.value.filter((it) => values.includes(it[props.valueField])).map(it => it[props.valueField])
  console.log(lastSelection)
  console.log(values)
  if (dontEmit) return
  if (lastSelection) emit('changed', lastSelection)
}
function initSelection(curr) {
  if (filteredItems.value.length && curr) {
    selectItem(curr)
  }
  if (curr && !lastSelection) {
    emit('changed', null)
  }
}
function itemSelected(val) {
  console.log(val)
  emit('selected', val)
  lastSelection.push(val)
  emit('changed', lastSelection)
}
function formatValue(value) {
  if (value == null) return ''
  return value.toString().toLowerCase()
}

function itemRemoved(v) {
  emit('removed', v)
  const index = lastSelection.indexOf(v)
  lastSelection.splice(index, 1)
  emit('changed', lastSelection)
}

</script>


<style src="@vueform/multiselect/themes/default.css"></style>