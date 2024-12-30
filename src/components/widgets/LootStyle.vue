
<template>
  <div>
    <div class="row">
      <div class="col-sm-4 center" v-for="opt in colorOpts">
        <div class="d-flex" style="width: 100%">
          <div class="me-2 center">{{opt}}</div>
          <span :id="`color-${opt}`" />
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-sm-4 d-flex align-items-center">
        <label>Font Size</label>
      </div>
      <div class="col-sm-4">
        <input
          type="number"
          v-model="fontSize"
          :min="minFont"
          :max="maxFont"
          class="form-control multiselect-height"
          @change="handleFontSizeChanged"
        />
      </div>
    </div>

    <!-- Area Level -->
    <div class="row mt-4">
      <div class="col-sm-4 d-flex align-items-center">
        <span>AreaLevel</span>
      </div>
      <div class="col-sm-4">
        <SimpleSelector
          :required="true"
          :current="areaLevel.op"
          :options="areaLevelOpts"
          @changed="v => areaLevel.op = v"
        />
      </div>
      <div v-if="areaLevel.op !== 'any'" :class="areaLevel.op === 'range' ? 'col-sm-2' : 'col-sm-4'">
        <input type="number" :min="0" :max="100" v-model="areaLevel.min" class="form-control multiselect-height" />
      </div>
      <div v-if="areaLevel.op === 'range'" class="col-sm-2">
        <input type="number" :min="0" :max="100" v-model="areaLevel.max" class="form-control multiselect-height" />
      </div>
    </div>

    <div class="mt-4 mb-4 btn-group w-100">
      <button type="button" class="btn btn-lg" :class="sectionActive === 0 ? 'btn-primary' : 'btn-secondary'" @click="sectionActive = 0">
        Icon
      </button>
      <button type="button" class="btn btn-lg" :class="sectionActive === 1 ? 'btn-primary' : 'btn-secondary'" @click="sectionActive = 1">
        Beam
      </button>
      <button type="button" class="btn btn-lg" :class="sectionActive === 2 ? 'btn-primary' : 'btn-secondary'" @click="sectionActive = 2">
        Sound
      </button>
    </div>
    <!-- Icon -->
    <div v-if="sectionActive === 0" class="row">
      <div class="col-sm-3 d-flex align-items-center">
        <div class="form-check text-start">
          <input type="checkbox" class="form-check-input me-2" :id="`icon-enabled${id ? '-'+id : ''}`" v-model="icon.enabled">
          <label class="form-check-label" :for="`icon-enabled${id ? '-'+id : ''}`">
            Enabled
          </label>
        </div>
      </div>
      <div class="col-sm-3">
        <SimpleSelector 
          :disabled="!icon.enabled"
          :required="true"
          :current="icon.size"
          :options="minimapIconSizes"
          @changed="v => icon.size = v"
        />
      </div>
      <div class="col-sm-3">
        <SimpleSelector 
          :disabled="!icon.enabled"
          :required="true"
          :current="icon.color"
          :options="minimapIconColors"
          @changed="v => icon.color = v"
        />
      </div>
      <div class="col-sm-3">
        <SimpleSelector 
          :disabled="!icon.enabled"
          :required="true"
          :current="icon.shape"
          :options="minimapIconShapes"
          @changed="v => icon.shape = v"
        />
      </div>
    </div>

    <!-- Beam -->
    <div v-if="sectionActive === 1" class="row">
      <div class="col-sm-4 d-flex align-items-center">
        <div class="form-check text-start">
          <input type="checkbox" class="form-check-input me-2" :id="`beam-enabled${id ? '-'+id : ''}`" v-model="beam.enabled">
          <label class="form-check-label" :for="`beam-enabled${id ? '-'+id : ''}`">
            Enabled
          </label>
        </div>
      </div>
      <div class="col-sm-4">
        <SimpleSelector
          :disabled="!beam.enabled"
          :required="true"
          :current="beam.color"
          :options="beamColors"
          @changed="v => beam.color = v"
        />
      </div>
      <div class="col-sm-4 d-flex align-items-center">
        <div class="form-check">
          <input type="checkbox" class="form-check-input me-2" :id="`beam-temporary${id ? '-'+id : ''}`" v-model="beam.temporary">
          <label class="form-check-label" :for="`beam-temporary${id ? '-'+id : ''}`">
            Temporary
          </label>
        </div>
      </div>
    </div>

    <!-- Sound -->
    <div v-if="sectionActive === 2" class="row">
      <div class="col-sm-3 d-flex align-items-center">
        <div class="form-check text-start">
          <input type="checkbox" class="form-check-input me-2" :id="`sound-enabled${id ? '-'+id : ''}`" v-model="sound.enabled">
          <label class="form-check-label" :for="`sound-enabled${id ? '-'+id : ''}`">
            Enabled
          </label>
        </div>
      </div>
      <div class="col-sm-3">
        <SimpleSelector
          :disabled="!sound.enabled"
          :required="true"
          :current="sound.type"
          :options="soundTypeOpts"
          @changed="handleSoundType"
          />
      </div>
      <div v-if="sound.type !== 'Custom'" class="col-sm-3">
        <SimpleSelector
          :disabled="!sound.enabled"
          :required="true"
          :current="sound.value"
          :options="soundRegularOpts"
          @changed="v => sound.value = v"
        />
      </div>
      <div v-else class="col-sm-3">
        <input type="text" class="form-control multiselect-height" v-model="sound.value" required/>
      </div>
      <div class="col-sm-3 d-flex align-items-center">
        <div class="me-2">Volume</div>
        <input type="range" min="0" max="300" v-model="sound.volume" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import SimpleSelector from './SimpleSelector.vue'
import { Style } from '../../types';
import { ref, reactive } from 'vue'
import ColorPicker from '@simonwep/pickr'
import '@simonwep/pickr/dist/themes/nano.min.css'
import { onMounted } from 'vue';
import { watch } from 'vue';

const emit = defineEmits(['changed'])
const props = defineProps<{
  id?: string,
  style?: Style
}>();

const colors = ['Blue', 'Green', 'Brown', 'Red', 'White', 'Yellow', 'Cyan', 'Grey', 'Orange', 'Green', 'Purple']
const _colorOpts = ['text', 'border', 'background']
const colorOpts = ref(_colorOpts)

const minFont = 18
const maxFont = 45
const sectionActive = ref(0)
const fontSize = ref(props.style?.fontSize || 28)

const color = ref(
  _colorOpts.reduce((o, opt) => 
    Object.assign(o, { [opt]: props.style?.[opt+'Color'] || '#FFFFFF' })
  , {})
)
const areaLevel = ref({
  op: props.style?.areaLevel?.op || '<',
  min: props.style?.areaLevel?.min || 0,
  max: props.style?.areaLevel?.max || 65
})
const icon = ref({
  enabled: props.style?.iconEnabled || false,
  size: 1,
  color: 'White',
  shape: 'Triangle'
})
const beam = ref({
  enabled: props.style?.beamEnabled || false,
  temporary: props.style?.beamTemporary || false,
  color: props.style?.beamColor || 'White'
})
const sound = ref({
  enabled: props.style?.soundEnabled || false,
  drop: props.style?.soundDrop || true,
  volume: props.style?.soundVolume || 100,
  type: props.style?.soundType || 'Normal',
  value: props.style?.soundFile || '1'
})

const areaLevelOpts = [
  { value: "any", label: 'Any' },
  { value: "<", label: '< Less than' },
  { value: "<=", label: '<= At most' },
  { value: ">", label: '> Greater than' },
  { value: ">=", label: '>= At least' },
  { value: "=", label: '= Equal to' },
  { value: "range", label: 'Range' },
]

const minimapIconSizes = ref([
  { value: 0, label: 'Large' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'Small' },
])
const minimapIconColors = ref(colors.map(v => ({ label: v, value: v })))
const minimapIconShapes = ref(
  ['Triangle', 'Square', 'Pentagon', 'Hexagon', 'Circle', 'Diamond', 'Start', 'Cross', 'Moon', 'Raindrop', 'Kite', 'UpsideDownhouse']
    .map(v => ({ label: v, value: v }))
)

const beamColors = ref(colors.map(v => ({ label: v, value: v })))

const soundTypeOpts = ref([
  { value: 'Normal', label: 'Normal' },
  { value: 'Positional', label: 'Positional' },
  { value: 'Custom', label: 'Custom'}
])
const soundRegularOpts = ref([
 { value: '1', label: '1' },
 { value: '2', label: '2' },
 { value: '3', label: '3' },
 { value: '4', label: '4' },
 { value: '5', label: '5' },
 { value: '6', label: '6' },
 { value: '7', label: '7' },
 { value: '8', label: '8' }, 
 { value: '9', label: '9' },
 { value: '10', label: '10' },
 { value: '11', label: '11' },
 { value: '12', label: '12' },
 { value: '13', label: '13' },
 { value: '14', label: '14' },
 { value: '15', label: '15' },
 { value: '16', label: '16' },
 { value: '17', label: 'Alchemy' },
 { value: '18', label: 'Blessed' },
 { value: '19', label: 'Chaos' },
 { value: '20', label: 'Fusing' },
 { value: '21', label: 'Power' },
 { value: '22', label: 'Regal' },
 { value: '23', label: 'Vaal' },
 { value: '24', label: 'Divine' },
 { value: '25', label: 'Exalted' },
 { value: '26', label: 'Mirror' },
])

const colorPickers = ref({})

onMounted(() => {
  emitChanges()
  _colorOpts.forEach(c => {
    colorPickers[c] = ColorPicker.create({
      el: `#color-${c}`,
      theme: 'nano',
      default: color.value[c],
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          hex: true,
          rgba: true,
          input: true,
          cancel: true,
          save: true,
          hsla: false,
          hsva: false,
          cmyk: false,
        }
      }
    })
    colorPickers[c].on('save', clr => {
      const [r,g,b,a] = clr.toHEXA()
      color.value[c] = `#${r}${g}${b}${a||'FF'}`
      colorPickers[c].hide()
      emitChanges()
    })
  })
})
function handleSoundType(v) {
  if (sound.value.type === 'Custom' || v === 'Custom') {
    sound.value.value = ''
  }
  sound.value.type = v
  emitChanges()
}

function handleFontSizeChanged(ev) {
  const v = ev.target.value
  if (v < minFont) {
    fontSize.value = minFont
  } else if (v > maxFont) {
    fontSize.value = maxFont
  }
  emitChanges()
}

watch(areaLevel, emitChanges)
watch(color, emitChanges)
watch(fontSize, emitChanges)
watch(icon, emitChanges)
watch(beam, emitChanges)
watch(sound, emitChanges)

function emitChanges() {
  emit('changed', {
    ...color.value,
    areaLevel: areaLevel.value,
    fontSize: fontSize,
    iconEnabled: icon.value.enabled,
    iconSize: icon.value.size,
    iconShape: icon.value.shape,
    iconColor: icon.value.color,
    beamEnabled: beam.value.enabled,
    beamColor: beam.value.color,
    beamTemporary: beam.value.temporary,
    soundEnabled: sound.value.enabled,
    soundDrop: sound.value.drop,
    soundType: sound.value.type,
    soundFile: sound.value.value,
    soundVolume: sound.value.volume,
  })
}

</script>

<style lang="scss">
.center {
  display: flex;
  align-items: center;
}
.pickr {
  padding: 0 1px 1px;
  border: 1px solid black;
}
</style>