import { getActiveWindow } from "@nut-tree/nut-js";
import { mouse } from "@nut-tree/nut-js";

export const getActiveWindowRegion = async () => {
    await getActiveWindow().then((activeWindow) => activeWindow.region);
};

export const getMousePosition = async () => {
    return await mouse.getPosition();
};

export const moveMouse = async (direction: any, moveStep: number) => {
    await mouse.move(direction(moveStep));
};