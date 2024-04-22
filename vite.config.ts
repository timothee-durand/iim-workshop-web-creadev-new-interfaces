import { defineConfig } from 'vite'
import Terminal from 'vite-plugin-terminal'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	server: {
		https: true
	},
	plugins: [
		Terminal({
			// console: 'terminal'
		}),
		mkcert()
	]
})
