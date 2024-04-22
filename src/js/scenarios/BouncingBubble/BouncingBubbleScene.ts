import { Scene2d } from '../../canva2d/Scene2d'
import { drawLine } from '../../canva2d/shapes2d'
import { clamp, distance2d, randomRange } from '../../utils/math'
import { UpdatePayload } from '../../utils/Time'
import { DeviceOrientationPayload } from '../../utils/device/DeviceOrientation'
import { Bubble, WallConfig } from './Bubble'
import { DeviceAccelerationPayload } from '../../utils/device/DeviceAcceleration'

export interface BouncingBubblesParams {
	radius: number
	threshold: number
	bubbleCount: number
	animationSpeed: number
	lineWidth: number
	gStrength: number
	walls: WallConfig
}

export class BouncingBubbleScene extends Scene2d {
	public bubbles: Bubble[] = []
	private readonly params: BouncingBubblesParams = {
		radius: 10,
		threshold: 70,
		bubbleCount: 20,
		animationSpeed: 1,
		lineWidth: 1,
		gStrength: 100,
		walls: {
			top: true,
			bottom: true
		}
	}

	constructor({ canvaId, params }: { canvaId: string; params: Partial<BouncingBubblesParams> }) {
		super(canvaId)
		this.params = { ...this.params, ...params }
		this.generateBubbles()
		this.addDebugs()
	}

	addDebugs() {
		const folder = this.debug.addFolder(this.canvaId)
		folder?.add(this.params, 'animationSpeed', { min: -3, max: 3 })
		folder?.add(this.params, 'radius', { min: 0, max: 50 })?.onChange((v) => {
			this.params.radius = v
			this.bubbles.forEach((b) => b.setRadius(v))
			this.draw()
		})

		folder?.add(this.params, 'gStrength', { min: 0, max: 500 })

		folder?.add(this.params, 'threshold', { min: 0, max: 200 })?.onChange(() => {
			this.draw()
		})

		folder?.add(this.params, 'bubbleCount', { min: 0, max: 500 })?.onFinishChange((v) => {
			this.params.bubbleCount = v
			this.generateBubbles()
		})

		folder?.add(this.params, 'lineWidth', { min: 0, max: 10 })?.onChange((v) => {
			this.context.lineWidth = v
			this.draw()
		})
	}

	generateBubbles() {
		this.bubbles = []
		for (let i = 0; i < this.params.bubbleCount; i++) {
			const bubble = new Bubble({
				x: randomRange(this.params.radius, this.width - this.params.radius),
				y: randomRange(this.params.radius, this.height - this.params.radius),
				radius: this.params.radius,
				context: this.context,
				walls: this.params.walls
			})
			this.bubbles.push(bubble)
		}
		this.draw()
	}

	draw() {
		this.clear()

		this.context.strokeStyle = 'white'
		this.context.fillStyle = 'black'
		this.context.lineCap = 'square'
		this.context.lineWidth = this.params?.lineWidth ?? 2
		this.bubbles?.forEach((b) => b.draw())

		for (let i = 0; i < this.bubbles?.length; i++) {
			const currentBubble = this.bubbles[i]
			for (let j = i; j < this.bubbles?.length; j++) {
				const nextBubble = this.bubbles[j] ?? this.bubbles[0]
				const distance = distance2d(currentBubble.coords, nextBubble.coords)
				if (distance < this.params.threshold) {
					drawLine({
						context: this.context,
						p1: currentBubble.coords,
						p2: nextBubble.coords
					})
				}
			}
		}
	}

	resize() {
		super.resize()
		this.draw()
	}

	update({ deltaTime }: UpdatePayload) {
		if (this.isPaused) return
		this.draw()
		this.bubbles?.forEach((b) => {
			b.update(this.width, this.height, deltaTime, this.params.animationSpeed)
		})
	}

	onDeviceAcceleration(p: DeviceAccelerationPayload) {
		// const normalizedX = clamp(p.gamma / 90, { min: -1, max: 1 })
		// const normalizedY = clamp(p.beta / 90, { min: -1, max: 1 })
		// const gx = normalizedX * this.params.gStrength
		// const gy = normalizedY * this.params.gStrength
		// this.bubbles?.forEach((b) => {
		// 	b.gx = gx
		// 	b.gy = gy
		// })
		const normalizedX = (p.x / 9.81) * this.params.gStrength
		const normalizedY = (-p.y / 9.81) * this.params.gStrength
		this.bubbles?.forEach((b) => {
			b.gx = normalizedX
			b.gy = normalizedY
		})
	}

	addBubble({
		x,
		y,
		radius,
		vx,
		vy
	}: {
		x: number
		y: number
		radius: number
		vx: number
		vy: number
	}) {
		const bubble = new Bubble({ x, y, radius, context: this.context, walls: this.params.walls })
		bubble.vx = vx
		bubble.vy = vy
		this.bubbles.push(bubble)
	}
}
