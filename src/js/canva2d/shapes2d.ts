import { degToRad } from '../utils/math'

export interface Style {
	isFilled?: boolean
	isStroked?: boolean
}

export interface Circle {
	x: number
	y: number
	radius: number
}

export function drawCircle({
	context,
	x,
	y,
	radius,
	style = { isStroked: true }
}: Circle & {
	context: CanvasRenderingContext2D
	style: Style
}) {
	context.beginPath()
	context.arc(x, y, radius, 0, degToRad(360))
	if (style?.isStroked) context.stroke()
	if (style?.isFilled) context.fill()
	context.closePath()
}

export interface Point {
	x: number
	y: number
	z?: number
}

export interface Line {
	p1: Point
	p2: Point
}

export function drawLine({
	context,
	p1,
	p2
}: Line & {
	context: CanvasRenderingContext2D
}) {
	context.beginPath()
	context.moveTo(p1.x, p1.y)
	context.lineTo(p2.x, p2.y)
	context.stroke()
	context.closePath()
}
