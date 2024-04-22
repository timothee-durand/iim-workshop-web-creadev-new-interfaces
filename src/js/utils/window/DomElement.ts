export class DomElement<T extends HTMLElement = HTMLElement> {
	public element: T
	public width: number = 0
	public height: number = 0
	public position: {
		left: number
		right: number
		top: number
		bottom: number
	} = {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}

	constructor(id: string) {
		this.element = document.getElementById(id) as T
		this.setSize()
	}

	setSize() {
		const rect = this.element.getBoundingClientRect()
		this.height = rect.height
		this.width = rect.width
		this.position = {
			top: rect.top,
			bottom: rect.bottom,
			left: rect.left,
			right: rect.right
		}
	}

	get isVisible() {
		return (
			this.position.bottom > 0 &&
			this.position.top < window.innerHeight &&
			this.position.left + this.width > 0 &&
			this.position.left < window.innerWidth
		)
	}

	get aspectRatio(): number {
		if (this.height === 0) return 0
		return this.width / this.height
	}
}
