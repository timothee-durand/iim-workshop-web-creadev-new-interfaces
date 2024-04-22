import { DomElement } from '../utils/window/DomElement'
import { WindowContext } from '../utils/window/WindowContext'
import { UpdatePayload } from '../utils/Time'
import { BasicScene } from '../BasicScene'
import { Mesh, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { DeviceAccelerationPayload } from '../utils/device/DeviceAcceleration'

export class Scene3d extends Scene implements BasicScene {
	protected canvas: HTMLCanvasElement
	protected domElement: DomElement<HTMLCanvasElement>
	protected windowContext: WindowContext
	protected canvaId: string
	protected camera: OrthographicCamera | PerspectiveCamera
	protected renderer: WebGLRenderer

	protected isPaused = false

	constructor(canvaId: string) {
		super()
		this.canvaId = canvaId
		this.domElement = new DomElement<HTMLCanvasElement>(this.canvaId)
		this.canvas = this.domElement.element
		this.windowContext = new WindowContext()
		this.windowContext.addScene(this)

		this.camera = new PerspectiveCamera(75, this.domElement.aspectRatio, 0.1, 200)
		this.add(this.camera)
		this.camera.position.z = 5
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		})

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

	update(payload: UpdatePayload) {
		if (this.isPaused) return
		this.renderer?.render(this, this.camera)
	}

	resize() {
		this.domElement.setSize()

		this.renderer?.setSize(this.width, this.height)
		this.renderer.setPixelRatio(this.windowContext.size.pixelRatio)
		if (this.camera instanceof PerspectiveCamera) {
			this.camera.aspect = this.domElement.aspectRatio
		}
		this.camera.updateProjectionMatrix()
	}

	scroll() {
		this.domElement.setSize()
		this.isPaused = !this.domElement.isVisible
	}

	onDeviceAcceleration(p: DeviceAccelerationPayload) {}

	destroy() {
		this.renderer.dispose()
		this.traverse((child) => {
			if (!(child instanceof Mesh)) return
			child.geometry.dispose()
			for (const key in child.material) {
				const material = child.material[key]
				if (material) {
					material.dispose()
				}
			}
		})
	}
}
