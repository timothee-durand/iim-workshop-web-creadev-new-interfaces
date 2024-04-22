import { EventEmitter } from '../events/EventEmitter'

export interface DeviceOrientationPayload {
	alpha: number
	beta: number
	gamma: number
}

export default class DeviceOrientation extends EventEmitter {
	private orientation = {
		alpha: 0,
		beta: 0,
		gamma: 0
	}

	constructor() {
		super()

		/** permission */
		if (navigator.permissions) {
			Promise.all([
				navigator.permissions.query({ name: 'accelerometer' }),
				navigator.permissions.query({ name: 'magnetometer' }),
				navigator.permissions.query({ name: 'gyroscope' })
			])
				.then((results) => {
					if (results.every((result) => result.state === 'granted')) {
						this.init()
					} else {
						console.log('Permission to use sensor was denied.')
					}
				})
				.catch((err) => {
					console.log('Integration with Permissions API is not enabled, still try to start app.')
					this.init()
				})
		} else {
			console.log('No Permissions API, still try to start app.')
			this.init()
		}
	}

	init() {
		window.addEventListener('deviceorientation', (e) => {
			if (e.alpha === null || e.gamma === null || e.beta === null) {
				return
			}
			this.orientation = {
				alpha: e.alpha,
				beta: e.beta,
				gamma: e.gamma
			}
			this.trigger<DeviceOrientationPayload>('reading', [this.orientation])
		})
	}
}
