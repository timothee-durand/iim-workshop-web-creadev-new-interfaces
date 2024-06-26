import { BoxGeometry, Color, Material, Mesh, MeshLambertMaterial } from 'three'
import { Bodies, Body } from 'matter-js'

export class Bubble extends Mesh {
	body: Body
	size: number

	constructor({ color, size }: { color: Color; size: number }) {
		const geometry = new BoxGeometry(size, size, 50)

		const material = new MeshLambertMaterial({
			color
		})
		super(geometry, material)
		this.size = size

		this.body = Bodies.rectangle(0, 0, size, size)
	}

	setPosition(x: number, y: number) {
		this.position.x = x
		this.position.y = y

		Body.setPosition(this.body, { x, y })
	}

	update() {
		this.position.x = this.body.position.x
		this.position.y = -this.body.position.y
		this.rotation.z = -this.body.angle
	}

	destroy() {
		this.geometry.dispose()
		if (this.material instanceof Material) {
			this.material.dispose()
		}
	}
}
