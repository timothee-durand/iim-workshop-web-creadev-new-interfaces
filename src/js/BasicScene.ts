import { UpdatePayload } from './utils/Time'
import { DeviceOrientationPayload } from './utils/device/DeviceOrientation'
import { DeviceAccelerationPayload } from './utils/device/DeviceAcceleration'

export interface BasicScene {
	update: (payload: UpdatePayload) => void

	resize: () => void

	scroll: () => void

	onDeviceAcceleration: (p: DeviceAccelerationPayload) => void

	destroy: () => void
}
