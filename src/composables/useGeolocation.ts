import { onMounted, onUnmounted, ref } from 'vue'

export const useGeolocation = () => {
  const coords = ref({ latitude: 0, longitude: 0 })
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  let watchId: number | null = null
  onMounted(() => {
    if (isSupported)
      watchId = navigator.geolocation.watchPosition(
        (pos) => (coords.value = pos.coords)
      )
  })

  onUnmounted(() => {
    if (watchId) navigator.geolocation.clearWatch(watchId)
  })

  return { coords, isSupported }
}
