import { Point } from '../canva2d/shapes2d'

export function randomRange(min: number, max: number): number {
	const _min = min > max ? max : min
	const _max = min > max ? min : max
	return Math.random() * (_max - _min) + _min
}

export function degToRad(deg: number): number {
	return (deg * Math.PI) / 180
}

export function distance2d(p1: Point, p2: Point): number {
	return Math.hypot(p2.x - p1.x, p2.y - p1.y)
}

export function clamp(value: number, { min, max }: { min: number; max: number }) {
	const _min = min > max ? max : min
	const _max = min > max ? min : max
	return Math.min(_max, Math.max(_min, value))
}
