import { Scene3d } from '../../canva3d/Scene3d'
import { UpdatePayload } from '../../utils/Time'
import { Color, OrthographicCamera } from 'three'
import { Wall } from './Wall'
import { clamp, randomRange } from '../../utils/math'
import { Body, Composite, Engine, Runner } from 'matter-js'
import { Bubble } from './Bubble'
import { DeviceAccelerationPayload } from '../../utils/device/DeviceAcceleration'

const getRandomColor = () => `hsl(${Math.round(randomRange(0, 360))}, 60%, 50%)`

export class SceneScenario3d extends Scene3d {
	camera: OrthographicCamera
	engine: Engine
	runner: Runner

	leftWall: Wall
	rightWall: Wall
	topWall: Wall
	bottomWall: Wall
	bubbles: Bubble[] = []
	walls: Wall[]

	params: {
		gStrength: number
	} = {
		gStrength: 300
	}

	constructor({ canvaId, bubbleCount }: { canvaId: string; bubbleCount: number }) {
		super(canvaId)
		this.camera = new OrthographicCamera(
			-this.width / 2,
			this.width / 2,
			this.height / 2,
			-this.height / 2
		)
		this.camera.position.z = 100

		// THREE

		this.leftWall = new Wall({ color: new Color('darkblue') })
		this.rightWall = new Wall({ color: new Color('darkblue') })
		this.topWall = new Wall({ color: new Color('tomato') })
		this.bottomWall = new Wall({ color: new Color('tomato') })
		this.walls = [this.leftWall, this.rightWall, this.topWall, this.bottomWall]

		this.add(this.leftWall)
		this.add(this.rightWall)
		this.add(this.topWall)
		this.add(this.bottomWall)

		this.leftWall.depth = 100
		this.rightWall.depth = 100
		this.topWall.depth = 100
		this.bottomWall.depth = 100

		const bubbleSize = 20
		for (let i = 0; i < bubbleCount; i++) {
			const color = getRandomColor()
			const bubble = new Bubble({
				color: new Color(color),
				size: bubbleSize
			})
			bubble.setPosition(
				randomRange(-this.width / 2 + bubbleSize, this.width / 2 - bubbleSize),
				randomRange(-this.height / 2 + bubbleSize, this.height / 2 - bubbleSize)
			)
			this.bubbles.push(bubble)
			this.add(bubble)
		}

		// MATTER
		this.engine = Engine.create({
			gravity: {
				scale: 0.008
			}
		})
		const bodies: Body[] = this.bubbles.map((b) => b.body).concat(this.walls.map((m) => m.body))
		Composite.add(this.engine.world, bodies)
		this.runner = Runner.create()
		Runner.run(this.runner, this.engine)

		this.resize()
	}

	update(payload: UpdatePayload) {
		super.update(payload)
		this.bubbles.forEach((b) => b.update())
		this.walls.forEach((w) => w.update())
	}

	resize() {
		super.resize()
		this.camera.top = this.height / 2
		this.camera.bottom = -this.height / 2
		this.camera.left = -this.width / 2
		this.camera.right = this.width / 2
		this.camera.updateProjectionMatrix()

		if (!this.leftWall) return

		const thickness = 10
		this.leftWall.setSize(thickness, this.height)
		this.rightWall.setSize(thickness, this.height)

		const freeSpace = 0.6
		const width = (this.width - thickness * 2) * freeSpace
		this.topWall.setSize(width, thickness)
		this.bottomWall.setSize(width, thickness)

		console.log(
			this.topWall.body.position.x,
			this.topWall.body.position.y,
			this.topWall.body.bounds.max.x - this.topWall.body.bounds.min.x,
			this.topWall.body.bounds.max.y - this.topWall.body.bounds.min.y
		)

		const halfThickness = thickness / 2
		this.leftWall.setPosition(-this.width / 2 + halfThickness, 0)
		this.rightWall.setPosition(this.width / 2 - halfThickness, 0)
		this.topWall.setPosition(
			-(this.width * (1 - freeSpace)) / 2 + halfThickness,
			-this.height * 0.1
		)
		this.bottomWall.setPosition(
			(this.width * (1 - freeSpace)) / 2 - halfThickness,
			this.height * 0.3
		)
	}

	onDeviceAcceleration(p: DeviceAccelerationPayload) {
		this.engine.gravity.x = p.x / 9.81
		this.engine.gravity.y = -p.y / 9.81
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
		const bubble = new Bubble({
			color: new Color(getRandomColor()),
			size: radius
		})
		bubble.setPosition(x - this.width / 2, y)
		this.bubbles.push(bubble)
		this.add(bubble)
		Composite.add(this.engine.world, bubble.body)
	}
}
