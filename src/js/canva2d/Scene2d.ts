import { DomElement } from '../utils/window/DomElement'
import { WindowContext } from '../utils/window/WindowContext'
import { UpdatePayload } from '../utils/Time'
import { DeviceOrientationPayload } from '../utils/device/DeviceOrientation'
import { BasicScene } from '../BasicScene'
import { DeviceAccelerationPayload } from '../utils/device/DeviceAcceleration'

export class Scene2d implements BasicScene {
	protected canvas: HTMLCanvasElement
	protected domElement: DomElement<HTMLCanvasElement>
	protected context: CanvasRenderingContext2D
	protected windowContext: WindowContext
	protected canvaId: string

	protected isPaused = false

	constructor(canvaId: string) {
		this.canvaId = canvaId
		this.domElement = new DomElement<HTMLCanvasElement>(this.canvaId)
		this.canvas = this.domElement.element
		const context = this.canvas.getContext('2d')
		if (!context) {
			throw new Error('No context')
		}
		this.context = context
		this.windowContext = new WindowContext()
		this.windowContext.addScene(this)
		this.resize()
		this.debug.add(
			{
				isPaused: () => {
					this.isPaused = !this.isPaused
				}
			},
			'isPaused',
			{ name: `Play / Pause ${this.canvaId}` }
		)
	}

	get width() {
		return this.domElement.width
	}

	get debug() {
		return this.windowContext.debug
	}
	get height() {
		return this.domElement.height
	}

	get position() {
		return this.domElement.position
	}

	update(payload: UpdatePayload) {}

	protected clear() {
		this.context.clearRect(0, 0, this.width, this.height)
	}

	resize() {
		this.domElement.setSize()
		const pixelRatio = this.windowContext.size.pixelRatio
		this.canvas.width = this.domElement.width * pixelRatio
		this.canvas.height = this.domElement.height * pixelRatio
		this.context.scale(pixelRatio, pixelRatio)
	}

	scroll() {
		this.domElement.setSize()
		this.isPaused = !this.domElement.isVisible
	}

	onDeviceAcceleration(p: DeviceAccelerationPayload) {}

	destroy() {}
}

function formatCoordinates(p: DeviceOrientationPayload): string {
	return Object.values(p)
		.map((v) => v.toFixed(2))
		.join(', ')
}
