import { getActiveWindow } from "@nut-tree/nut-js";
import { mouse, left, down, right, up, keyboard } from "@nut-tree/nut-js";

export const getActiveWindowRegion = async () => {
    await getActiveWindow().then((activeWindow) => activeWindow.region);
};

export const moveMouseSquare = async () => {
    await mouse.move(left(200));
    await mouse.move(down(200));
    await mouse.move(right(200));
    await mouse.move(up(200));
};

export const moveMouseRect = async () => {
    await mouse.move(left(200));
    await mouse.move(down(150));
    await mouse.move(right(200));
    await mouse.move(up(150));
};

export const getMousePosition = async () => {
    return await mouse.getPosition();
    // console.log(currentPosition, 'Current mousePosition');
};

export const setMousePosition = async () => {
    await getMousePosition();

};

export const getKeyValue = async (key: any) => {
    keyboard.type(key.toLowercase()).toString();

    // if (keyType === 's') {
    //     await moveMouseSquare();
    // }

    // if (keyType === 'r') {
    //     await moveMouseSquare();
    // }
}



