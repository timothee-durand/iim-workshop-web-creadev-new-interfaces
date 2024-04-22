import { BouncingBubbleScene } from './js/scenarios/BouncingBubble/BouncingBubbleScene'
import { askAccess } from './js/utils/device/DeviceAccess'
import { SceneScenario3d } from './js/scenarios/Scenario3d/SceneScenario3d'
import { WindowContext } from './js/utils/window/WindowContext'
import { UpdatePayload } from './js/utils/Time'
import { Bubble as Bubble3d } from './js/scenarios/Scenario3d/Bubble'
import { randomRange } from './js/utils/math'

document.querySelector('#permissions')?.addEventListener('click', async () => {
	const result = await askAccess()
	console.log(`permission result ${result}`)
})
const windowContext = new WindowContext()

const scene1 = new BouncingBubbleScene({
	canvaId: 'canvas-scene',
	params: {
		radius: 10,
		threshold: 50,
		bubbleCount: 30,
		animationSpeed: 1,
		lineWidth: 1,
		gStrength: 20,
		walls: {
			top: true,
			bottom: false
		}
	}
})
const scene3 = new BouncingBubbleScene({
	canvaId: 'canvas-scene-2',
	params: {
		radius: 6,
		threshold: 100,
		bubbleCount: 30,
		animationSpeed: 1,
		lineWidth: 0.3,
		gStrength: 50,
		walls: {
			top: false,
			bottom: true
		}
	}
})

const scene2 = new SceneScenario3d({ canvaId: 'canvas-scene-3', bubbleCount: 3 })

const time = windowContext.time
time.on<UpdatePayload>('update', () => {
	scene1.bubbles = scene1.bubbles.filter((b, i) => {
		if (b.coords.y > scene1.height + b.radius) {
			scene2.addBubble({
				x: b.coords.x,
				y: -scene2.height / 2 - b.radius,
				radius: b.radius,
				vx: b.vx,
				vy: b.vy
			})
			return false
		}
		return true
	})
	const newScene3Bubbles: Bubble3d[] = []
	scene2.bubbles.forEach((b, i) => {
		if (b.position.y > scene2.height) {
			scene1.addBubble({
				x: b.position.x + scene2.width / 2,
				y: scene1.height + b.size * 2,
				radius: b.size,
				vy: randomRange(-300, -30),
				vx: randomRange(-100, 100)
			})
			b.destroy()
			return
		}
		if (b.position.y < -scene2.height) {
			scene3.addBubble({
				x: b.position.x + scene2.width / 2,
				y: b.size * 2,
				radius: b.size,
				vy: randomRange(30, 300),
				vx: randomRange(-100, 100)
			})
			b.destroy()
			return
		}
		newScene3Bubbles.push(b)
	})
	scene2.bubbles = newScene3Bubbles
	scene3.bubbles = scene3.bubbles.filter((b, i) => {
		if (b.coords.y < -b.radius) {
			scene2.addBubble({
				x: b.coords.x,
				y: scene2.height / 2 + b.radius,
				radius: b.radius,
				vx: b.vx,
				vy: b.vy
			})
			return false
		}
		return true
	})
})
