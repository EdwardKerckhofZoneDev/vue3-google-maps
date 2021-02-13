<template>
  <div class="header">
    <h1>Your Position</h1>
    <p>
      Latitude: {{ currentPos.lat.toFixed(2) }}, Longitude:
      {{ currentPos.lng.toFixed(2) }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useGeolocation } from './composables/useGeolocation'

export default defineComponent({
  name: 'App',

  setup() {
    // Holds user coords
    const { coords } = useGeolocation()
    // Computed to it changes when coords change
    const currentPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))

    return { currentPos }
  }
})
</script>

<style lang="scss">
@import './assets/scss/main.scss';
</style>
