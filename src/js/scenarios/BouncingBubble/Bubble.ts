import { randomRange } from '../../utils/math'
import { Circle, drawCircle } from '../../canva2d/shapes2d'

export interface WallConfig {
	top: boolean
	bottom: boolean
}

export class Bubble {
	public radius: number
	private readonly context: CanvasRenderingContext2D
	private x: number
	private y: number
	public vx = randomRange(-300, 300)
	public vy = randomRange(-300, 300)
	public gx = 0
	public gy = 0
	private walls: WallConfig

	constructor({
		x,
		y,
		radius,
		context,
		walls
	}: Circle & { context: CanvasRenderingContext2D; walls: WallConfig }) {
		this.x = x
		this.y = y
		this.radius = radius
		this.context = context
		this.walls = walls
	}

	draw() {
		drawCircle({
			x: this.x,
			y: this.y,
			radius: this.radius,
			context: this.context,
			style: { isStroked: true, isFilled: true }
		})
	}

	update(width: number, height: number, deltaTime: number, speed: number) {
		const deltaTimeSeconds = (deltaTime / 1000) * speed
		this.x += this.vx * deltaTimeSeconds + this.gx
		this.y += this.vy * deltaTimeSeconds + this.gy
		if (this.x < this.radius) {
			this.invertVx()
			this.x = this.radius
		}
		if (this.x > width - this.radius) {
			this.invertVx()
			this.x = width - this.radius
		}
		if (this.y < this.radius && this.walls.top) {
			this.invertVy()
			this.y = this.radius
		}
		if (this.y > height - this.radius && this.walls.bottom) {
			this.invertVy()
			this.y = height - this.radius
		}

		this.draw()
	}

	invertVx() {
		this.vx = -this.vx
	}

	invertVy() {
		this.vy = -this.vy
	}

	get coords() {
		return {
			x: this.x,
			y: this.y
		}
	}

	setRadius(radius: number) {
		this.radius = radius
	}
}
