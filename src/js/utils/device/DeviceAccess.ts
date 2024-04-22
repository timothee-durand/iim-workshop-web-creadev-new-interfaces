declare global {
	interface Window {
		DeviceOrientationEvent: {
			requestPermission: () => Promise<string> | null
		}
	}
}

export async function askAccess() {
	if (typeof window.DeviceOrientationEvent.requestPermission == 'function') {
		const result = await window.DeviceOrientationEvent.requestPermission()
		return result === 'granted'
	}
	return false
}
