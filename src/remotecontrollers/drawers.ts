import { mouse, left, down, right, up } from "@nut-tree/nut-js";
import { getMousePosition } from "./mousehandler";


export const drawSquare = async (width: number) => {
    try {
        await mouse.drag(left(width));
        await mouse.drag(down(width));
        await mouse.drag(right(width));
        await mouse.drag(up(width));
    } catch (e: any) {
        throw new Error('Drawing square failed', e.message);
    }
};

export const drawRectangle = async (width: number, length: number) => {
    try {
        await mouse.drag(left(length));
        await mouse.drag(down(width));
        await mouse.drag(right(length));
        await mouse.drag(up(width));
    } catch (e: any) {
        throw new Error('Drawing rectangle failed', e.message);
    }
};

export const drawCircle = async (radius: number) => {
    try {
        const startPoint = await getMousePosition();

        const points = [];

        for (let i = 0; i <= 360; i += 1) {
            const rad = Math.PI / 180;
            const x = startPoint.x + (radius * Math.cos(i * rad)) - radius;
            const y = startPoint.y + (radius * Math.sin(i * rad));

            points.push({ x, y });
        }

        await mouse.drag(points);
    } catch (e: any) {
        throw new Error('Drawing circle failed', e.message);
    }
};