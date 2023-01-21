import { Region, screen } from "@nut-tree/nut-js";
import Jimp from "jimp";

import { getMousePosition } from "./mousehandler";

const PRINT_SIZE = 200;
const HALF_PRINT_SIZE = PRINT_SIZE / 2;

export const calcXY = async () => {
    try {
        const screenWidth = await screen.width();
        const screenHeight = await screen.height();

        const { x, y } = await getMousePosition();

        let calcx: number;
        let calcy: number;

        if (x < HALF_PRINT_SIZE) {
            calcx = 0;
        } else if (x > (screenWidth - PRINT_SIZE)) {
            calcx = screenWidth - PRINT_SIZE;
        } else {
            calcx = x - HALF_PRINT_SIZE;
        }

        if (y < HALF_PRINT_SIZE) {
            calcy = 0;
        } else if (y > (screenHeight - PRINT_SIZE)) {
            calcy = screenHeight - PRINT_SIZE;
        } else {
            calcy = y - HALF_PRINT_SIZE;
        }
        return { calcx, calcy };
    } catch (e) {
        throw new Error(e.message);
    }
};

export const printScreen = async () => {
    try {
        const startPoint = await calcXY();
        const x = startPoint.calcx;
        const y = startPoint.calcy;

        const region = new Region(x, y, PRINT_SIZE, PRINT_SIZE);

        const bitmap = await (await screen.grabRegion(region)).toRGB();

        const jimp = new Jimp(200, 200);

        jimp.bitmap.data = bitmap.data;
        jimp.bitmap.width = bitmap.width;
        jimp.bitmap.height = bitmap.height;

        const buffer = await jimp.getBufferAsync(Jimp.MIME_PNG);
        const buffered = buffer.toString("base64");

        return `prnt_scrn ${buffered}`;
    } catch (e) {
        throw new Error(e.message);
    }
};