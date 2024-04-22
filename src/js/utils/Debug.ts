import { GUI, GUIController } from 'dat.gui'

export class Debug {
	private gui: GUI | null = null
	#isGuiActive = false

	constructor() {
		if ('debug' in window.document.body.dataset) {
			this.isGuiActive = true
		}
	}

	public set isGuiActive(value: boolean) {
		this.#isGuiActive = value
		if (!this.gui) {
			this.gui = new GUI()
			this.gui.close()
		}
	}

	public add<T>(
		value: T,
		name: keyof T,
		params?: {
			min?: number
			max?: number
			name?: string
		},
		folder?: GUI
	): GUIController | null {
		if (!this.#isGuiActive || !this.gui) return null
		const gui = folder ?? this.gui
		const controller = gui.add(value, name, params?.min, params?.max)
		if (params?.name) {
			controller.name(params.name)
		} else {
			controller.name(
				(name as string)
					.split(/(?=[A-Z])/)
					.map((s) => s.toLowerCase())
					.join(' ')
			)
		}
		return controller || null
	}

	public addFolder(name: string): {
		add: <T>(
			value: T,
			name: keyof T,
			params?: {
				min?: number
				max?: number
				name?: string
			}
		) => GUIController | null
	} | null {
		if (!this.gui || !this.#isGuiActive) return null
		const folder = this.gui.addFolder(name)
		return {
			add: (v, n, p) => this.add(v, n, p, folder)
		}
	}

	public get isActive() {
		return this.#isGuiActive
	}

	public destroy() {
		this.gui?.destroy()
	}
}
