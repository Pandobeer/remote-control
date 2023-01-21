import { httpServer } from "./src/http_server/index";
import { down, left, right, up } from "@nut-tree/nut-js";
import { createWebSocketStream, WebSocketServer } from 'ws';
import { getMousePosition, moveMouse } from "./src/remotecontrollers/mousehandler";
import { drawCircle, drawRectangle, drawSquare } from './src/remotecontrollers/drawers';
import { printScreen } from './src/remotecontrollers/capturescreen';

const HTTP_PORT = 8181;
const ALT_HTTP_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: ALT_HTTP_PORT });

wss.on('connection', async (ws) => {
    try {
        console.log('Connection opened');

        const wsStream = createWebSocketStream(
            ws,
            {
                encoding: "utf-8",
                decodeStrings: false,
            });

        wsStream.on("data", async (chunk: any) => {
            const [command, ...args] = chunk.toString().split(" ");

            const moveStep = Number(args[0]);
            const commandSplitted = command.toString().split("_")[1];

            const width = moveStep;
            const length = Number(args[1]);
            const radius = moveStep;

            switch (commandSplitted) {
                case 'up':
                    await moveMouse(up, moveStep);
                    wsStream.write(command);
                    break;

                case 'down':
                    await moveMouse(down, moveStep);
                    wsStream.write(command);
                    break;

                case 'left':
                    await moveMouse(left, moveStep);
                    wsStream.write(command);
                    break;

                case 'right':
                    await moveMouse(right, moveStep);
                    wsStream.write(command);
                    break;

                case 'position':
                    const { x, y } = await getMousePosition();
                    const result = `mouse_position ${x}px,${y}px`;
                    wsStream.write(result);
                    break;

                case 'rectangle':
                    await drawRectangle(width, length);
                    wsStream.write(command);
                    break;

                case 'square':
                    await drawSquare(width);
                    wsStream.write(command);
                    break;

                case 'circle':
                    await drawCircle(radius);
                    wsStream.write(command);
                    break;

                case 'scrn':
                    const bufferSrc = await printScreen();
                    wsStream.write(bufferSrc);
                    break;

                default:
                    await moveMouse(up, moveStep);
                    wsStream.write(command);
                    console.log('default Up');
                    break;
            }
        });

        console.log(`The WebSocket server is running on port ${ALT_HTTP_PORT}`);


        wsStream.on('close', () => {
            console.log('Connection closed');
        });

        wsStream.on('error', (e) => {
            throw new Error(e.message);
        });
    } catch (e: any) {
        throw new Error(e.message);
    }
});