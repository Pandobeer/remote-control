import { httpServer } from "./src/http_server/index";
import { down, left, right, up } from "@nut-tree/nut-js";
import { createWebSocketStream, WebSocketServer } from 'ws';
import { getMousePosition, moveMouse } from "./src/remotecontrollers/mousehandler";
import { drawCircle, drawRectangle, drawSquare } from './src/remotecontrollers/drawers';
import { printScreen } from './src/remotecontrollers/capturescreen';

const HTTP_PORT = 8181;
const ALT_WSS_PORT = 4000;

httpServer.listen(HTTP_PORT, () => {
    process.stdout.write(`Static http server is running on the ${HTTP_PORT} port \n`);
    process.stdout.write(`The WebSocket server is running on port ${ALT_WSS_PORT} \n`);
});

const wss = new WebSocketServer({ port: ALT_WSS_PORT });

wss.on("connection", async (ws) => {

    process.stdout.write('Websocket connection is opened \n');

    const wsStream = createWebSocketStream(
        ws,
        {
            encoding: "utf-8",
            decodeStrings: false,
        });

    try {
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

        wsStream.on('error', (e: any) => {
            console.error(e.message);
        });

    } catch (e: any) {
        console.error(e.message);
    }
});

process.on('SIGINT', () => {
    process.stdout.write('Connection closed \n');

    wss.clients.forEach((socket) => {
        socket.close();
    });
    wss.close();

});

