import { Scene2d } from '../../canva2d/Scene2d'
import { Time, UpdatePayload } from '../Time'
import { Debug } from '../Debug'
import DeviceOrientation, { DeviceOrientationPayload } from '../device/DeviceOrientation'
import { BasicScene } from '../../BasicScene'
import { DeviceAcceleration } from '../device/DeviceAcceleration'

let instance: WindowContext | null

export class WindowContext {
	private scenes: BasicScene[] = []
	time: Time = new Time()
	public debug!: Debug
	private removeEventListener?: () => void

	private deviceAcceleration!: DeviceAcceleration

	private acceleration = {
		x: 0,
		y: 0,
		z: 0
	}

	constructor() {
		if (instance) return instance
		instance = this
		this.debug = new Debug()
		this.deviceAcceleration = new DeviceAcceleration()
		this.removeEventListener = this.addEventListeners()
		window.addEventListener('beforeunload', () => this.destroy())
		this.time.update()
		return instance
	}

	public addScene(scene: BasicScene) {
		this.scenes.push(scene)
	}

	private resize() {
		this.scenes.forEach((s) => {
			s.resize()
		})
	}

	private scroll() {
		this.scenes.forEach((s) => {
			s.scroll()
		})
	}

	private update(p: UpdatePayload) {
		this.scenes.forEach((s) => {
			s.update(p)
		})
	}

	private addEventListeners() {
		const onResize = () => this.resize()
		window.addEventListener('resize', onResize)

		const onScroll = () => this.scroll()
		window.addEventListener('scroll', onScroll)

		const onUpdate = (p: UpdatePayload) => this.update(p)
		this.time.on<UpdatePayload>('update', onUpdate)

		this.deviceAcceleration.on<DeviceOrientationPayload>('reading', (p) => {
			this.scenes.forEach((s) => {
				s.onDeviceAcceleration(p)
			})
		})

		return () => {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onResize)
			this.time.off('update')
		}
	}

	private destroy() {
		if (this.removeEventListener) this.removeEventListener()
		this.scenes.forEach((s) => s.destroy())
		this.scenes = []
		this.debug.destroy()
	}

	get size() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			pixelRatio: Math.min(window.devicePixelRatio, 2)
		}
	}
}
