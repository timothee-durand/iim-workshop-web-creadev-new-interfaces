import { EventEmitter } from './events/EventEmitter'

export interface UpdatePayload {
	deltaTime: number
}

export class Time extends EventEmitter {
	private readonly start: number
	private current: number
	elapsed: number
	delta: number

	constructor() {
		super()
		this.start = Date.now()
		this.current = this.start
		this.elapsed = 0
		this.delta = 16
	}

	update() {
		const now = Date.now()
		this.delta = now - this.current
		this.current = now
		this.elapsed = this.current - this.start

		this.trigger<UpdatePayload>('update', [{ deltaTime: this.delta }])

		window.requestAnimationFrame(() => this.update())
	}
}
