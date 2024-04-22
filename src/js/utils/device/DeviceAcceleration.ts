import { EventEmitter } from '../events/EventEmitter'
import { Accelerometer } from '../../../lib/sensor-polyfills/src/motion-sensors.js'

export interface DeviceAccelerationPayload {
	x: number
	y: number
	z: number
}

export class DeviceAcceleration extends EventEmitter {
	sensor?: Accelerometer
	x = 0
	y = 0
	z = 0

	constructor() {
		super()

		/** permission */
		if (navigator.permissions) {
			Promise.all([navigator.permissions.query({ name: 'accelerometer' })])
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
		this.sensor = new Accelerometer({ frequency: 60 })
		this.sensor.addEventListener('reading', (e) => {
			this.x = this.sensor.x
			this.y = this.sensor.y
			this.z = this.sensor.z

			this.trigger<DeviceAccelerationPayload>('reading', [
				{
					x: this.x,
					y: this.y,
					z: this.z
				}
			])
		})
		this.sensor.start()
	}
}
