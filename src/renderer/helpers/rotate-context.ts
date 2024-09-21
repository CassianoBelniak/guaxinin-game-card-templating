import { Rect } from '../classes/rect.js'

export function rotateContext(
    ctx: CanvasRenderingContext2D,
    rect: Rect,
    ammount: number,
    offsetX: number,
    offsetY: number,
) {
    if (ammount) {
        ctx.translate(rect.x + offsetX, rect.y + offsetY)
        ctx.rotate(ammount)
        ctx.translate(-(rect.x + offsetX), -(rect.y + offsetY))
    }
}
