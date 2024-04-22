import {
	BoxGeometry,
	Color,
	Mesh,
	MeshLambertMaterial,
	MeshMatcapMaterial,
	MeshToonMaterial,
	TextureLoader
} from 'three'
import { Bodies, Body } from 'matter-js'
import Matcap2 from './assets/matcap-2.png'

export class Wall extends Mesh {
	depth: number = 1

	body: Body

	constructor({ color = new Color('blue') }: { color?: Color }) {
		const geometry = new BoxGeometry(1, 1, 1)
		const material = new MeshLambertMaterial({
			color
		})
		super(geometry, material)

		this.body = Bodies.rectangle(0, 0, 1, 1, { isStatic: true })
	}

	setSize(width: number, height: number) {
		Body.scale(this.body, width / this.scale.x, height / this.scale.y)
		this.scale.set(width, height, this.depth)
	}

	setPosition(x: number, y: number) {
		this.position.x = x
		this.position.y = y

		Body.setPosition(this.body, { x, y })
	}

	update() {
		this.position.x = this.body.position.x
		this.position.y = -this.body.position.y
	}
}
