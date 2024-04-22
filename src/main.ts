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
		threshold: 40,
		bubbleCount: 10,
		animationSpeed: 1,
		lineWidth: 1,
		gStrength: 50,
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
		threshold: 40,
		bubbleCount: 10,
		animationSpeed: 1,
		lineWidth: 0.5,
		gStrength: 50,
		walls: {
			top: false,
			bottom: true
		}
	}
})

const scene2 = new SceneScenario3d({ canvaId: 'canvas-scene-3', bubbleCount: 10 })

let previousLength = [scene1.bubbles.length, scene2.bubbles.length, scene3.bubbles.length]
const time = windowContext.time
time.on<UpdatePayload>('update', () => {
	scene1.bubbles = scene1.bubbles.filter((b) => {
		const stayInScene1 = b.coords.y < scene1.height + b.radius
		// if (!stayInScene1) {
		// 	scene2.addBubble({
		// 		x: b.coords.x,
		// 		y: -scene2.height / 2,
		// 		radius: b.radius,
		// 		vx: b.vx,
		// 		vy: b.vy
		// 	})
		// }
		return stayInScene1
	})
	const newScene3Bubbles: Bubble3d[] = []
	scene2.bubbles.forEach((b) => {
		const goToScene1 = b.position.y > scene2.height + b.size
		const goToScene3 = b.position.y < -scene2.height - b.size
		if (!goToScene1 && !goToScene3) {
			newScene3Bubbles.push(b)
			return
		}
		if (goToScene1) {
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
		if (goToScene3) {
			scene3.addBubble({
				x: b.position.x + scene2.width / 2,
				y: b.size * 2,
				radius: b.size,
				vy: randomRange(30, 300),
				vx: randomRange(-100, 100)
			})
			b.destroy()
		}
	})
	scene2.bubbles = newScene3Bubbles
	scene3.bubbles = scene3.bubbles.filter((b) => {
		const shouldGoTo2 = b.coords.y < -b.radius
		if (shouldGoTo2) {
			scene2.addBubble({
				x: b.coords.x,
				y: scene2.height / 2,
				radius: b.radius,
				vx: b.vx,
				vy: b.vy
			})
		}
		return !shouldGoTo2
	})
	if (
		previousLength[0] !== scene1.bubbles.length ||
		previousLength[1] !== scene2.bubbles.length ||
		previousLength[2] !== scene3.bubbles.length
	) {
		console.log(previousLength[0], previousLength[1], previousLength[2])
		console.log(scene1.bubbles.length, scene2.bubbles.length, scene3.bubbles.length)
		console.log(
			previousLength.reduce((acc, curr) => acc + curr, 0),
			scene1.bubbles.length + scene2.bubbles.length + scene3.bubbles.length
		)
		console.log('----')
	}
	previousLength = [scene1.bubbles.length, scene2.bubbles.length, scene3.bubbles.length]
})
