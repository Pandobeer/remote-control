import { httpServer } from "./src/http_server/index";
import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';
import { getActiveWindowRegion, getMousePosition, moveMouse } from "./src/mousehandler/mousehandler";
import { send } from "process";
import { drawCircle, drawRectangle, drawSquare } from './src/mousehandler/drawers';

const HTTP_PORT = 8181;
const ALT_HTTP_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: ALT_HTTP_PORT });

// // const ws = new WebSocket(`ws://localhost:${ALT_HTTP_PORT}`);
// // const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

// // duplex.pipe(process.stdout);
// // process.stdin.pipe(duplex);


wss.on('connection', async (ws) => {
    try {
        console.log('Connection opened');

        const wsStream = createWebSocketStream(ws, {
            encoding: "utf-8",
            decodeStrings: false,
        });

        wsStream.on("data", async (chunk: any) => {
            const [command, ...args] = chunk.toString().split(" ");

            const moveStep = Number(args[0]);
            const direction = command.toString().split("_")[1];

            const width = moveStep;
            const length = Number(args[1]);
            const radius = moveStep;

            console.log(command);

            switch (direction) {
                case 'up':
                    await moveMouse(up, moveStep);
                    ws.send(command);
                    break;

                case 'down':
                    await moveMouse(down, moveStep);
                    ws.send(command);
                    break;

                case 'left':
                    await moveMouse(left, moveStep);
                    ws.send(command);
                    break;

                case 'right':
                    await moveMouse(right, moveStep);
                    ws.send(command);
                    break;

                case 'position':
                    const { x, y } = await getMousePosition();
                    const result = `mouse_position ${x}px,${y}px`;
                    ws.send(result);
                    break;

                case 'rectangle':
                    await drawRectangle(width, length);
                    ws.send(command);
                    break;

                case 'square':
                    await drawSquare(width);
                    ws.send(command);
                    break;

                case 'circle':
                    await drawCircle(radius);
                    ws.send(command);
                    break;

                default:
                    await moveMouse(up, moveStep);
                    ws.send(command);
                    console.log('default Up');
                    break;
            }
        });

        console.log(`The WebSocket server is running on port ${ALT_HTTP_PORT}`);

        // wsStream.on('message', (data: any, isBinary) => {
        //     const message = data.toString('utf-8');
        //     console.log(message);

        //     // if (message.type === 'NEW_MESSAGE') {
        //     wss.clients.forEach(async (client) => {
        //         if (client !== ws && client.readyState === WebSocket.OPEN) {
        //             // client !== ws && 
        //             // getActiveWindowRegion();
        //             // moveMouse();
        //             client.send(data, { binary: isBinary });
        //             // if (message === "s") {
        //             // await getKeyValue("s");
        //             // await moveMouseSquare();

        //             // }
        //         }
        //     });
        // });

        ws.on('close', () => {
            console.log('Connection closed');
        });

        ws.on('error', (e) => {
            throw new Error(e.message);
        });
    } catch (e: any) {
        throw new Error(e.message);
    }
});

// stream = createWebSocketStream(ws, options)
// stream.write(...)