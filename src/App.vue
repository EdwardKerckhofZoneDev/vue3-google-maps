<template>
  <div class="header">
    <div class="user-pos">
      <h1>Your Position</h1>
      <p>
        Latitude: {{ currentPos.lat.toFixed(2) }}, Longitude:
        {{ currentPos.lng.toFixed(2) }}
      </p>
    </div>
    <div class="clicked-pos">
      <h1>Clicked Position</h1>
      <p v-if="clickedPos">
        Latitude: {{ clickedPos.lat.toFixed(2) }}, Longitude:
        {{ clickedPos.lng.toFixed(2) }}
      </p>
      <p v-else>Click the map to select a position</p>
    </div>
  </div>
  <div ref="mapRef" class="google-map"></div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { useGeolocation } from './composables/useGeolocation'
import { Loader } from '@googlemaps/js-api-loader'

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
    // Get clicked position of the user
    const clickedPos = ref<{
      lat: number
      lng: number
    } | null>(null)

    // Google maps loader
    const loader = new Loader({
      apiKey: 'AIzaSyBcO-Xg5pqUrFitJXyt0P5UEQjgja8c2WM'
    })

    // Map ref
    const mapRef = ref(null)
    // Map element
    let map = ref<google.maps.Map | null>(null)
    // Map clickListener
    let clickListener: google.maps.MapsEventListener | null = null

    onMounted(async () => {
      // Load the mad
      await loader.load()
      // Get the loaded map
      map.value = new google.maps.Map(mapRef.value!, {
        center: currentPos.value,
        zoom: 7
      })
      // Add click event to map
      clickListener = map.value.addListener(
        'click',
        ({ latLng: { lat, lng } }) =>
          (clickedPos.value = { lat: lat(), lng: lng() })
      )
    })

    onUnmounted(async () => {
      // Remove clickListener
      if (clickListener) clickListener.remove()
    })

    // Watch any map or position changes
    let line: google.maps.Polyline | null = null
    watch([map, currentPos, clickedPos], () => {
      // If a line is already drawn, remove it
      if (line) line.setMap(null)
      // Draw line from users position to clicked position
      if (map.value && clickedPos.value !== null)
        line = new google.maps.Polyline({
          path: [currentPos.value, clickedPos.value],
          map: map.value
        })
    })

    return { currentPos, mapRef, clickedPos }
  }
})
</script>

<style lang="scss">
@import './assets/scss/main.scss';
</style>
