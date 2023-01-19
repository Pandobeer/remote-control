import { httpServer } from "./src/http_server/index";
import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';
import { getActiveWindowRegion, getKeyValue, getMousePosition, moveMouseSquare } from "./src/mousehandler/mousehandler";
import { send } from "process";

const HTTP_PORT = 8181;
const ALT_HTTP_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: ALT_HTTP_PORT });

// wss.on("connection", async (ws) => {
//     const wsStream = createWebSocketStream(ws, {
//         encoding: "utf-8",
//         decodeStrings: false,
//     });

//     wsStream.on("data", async (chunk) => {
//         const [func, ...args] = chunk.toString().split(" ");

//         if (func === "mouse_up") {
//             console.log(args);
//         }

//         if (func === "mouse_down") {
//             console.log(args);
//         }

//         if (func === "mouse_position") {
//         }
//     });

//     console.log(`The WebSocket server is running on port ${ALT_HTTP_PORT}`);
// });


// // const ws = new WebSocket(`ws://localhost:${ALT_HTTP_PORT}`);
// // const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

// // duplex.pipe(process.stdout);
// // process.stdin.pipe(duplex);



wss.on('connection', async (ws) => {
    console.log('Connection opened');

    const wsStream = createWebSocketStream(ws, {
        encoding: "utf-8",
        decodeStrings: false,
    });

    // let result: any;


    wsStream.on("data", async (chunk: any) => {
        const [command, ...args] = chunk.toString().split(" ");


        if (command === "mouse_up") {
            await mouse.move(up(args[0]));
        }

        if (command === "mouse_down") {
            await mouse.move(down(Number(args[0])));
        }

        if (command === "mouse_left") {
            await mouse.move(left(Number(args[0])));
        }

        if (command === "mouse_right") {
            await mouse.move(right(Number(args[0])));
        }

        if (command === "mouse_position") {
            const { x, y } = await getMousePosition();
            const result = `mouse_position ${x}px,${y}px`;

            ws.send(result);
        }
    });

    console.log(`The WebSocket server is running on port ${ALT_HTTP_PORT}`);
    // ws.send(moveMouse());
    // ws.on('open', () => {
    // });

    // ws.on('message', (data) => {
    //     console.log('received: %s', data);
    //     // wss.clients.forEach(client => client.send(data));
    // });

    wsStream.on('message', (data: any, isBinary) => {
        const message = data.toString('utf-8');
        console.log(message);

        // if (message.type === 'NEW_MESSAGE') {
        wss.clients.forEach(async (client) => {
            if (client.readyState === WebSocket.OPEN) {
                // client !== ws && 
                // getActiveWindowRegion();
                // moveMouse();
                client.send(data, { binary: isBinary });
                // if (message === "s") {
                // await getKeyValue("s");
                // await moveMouseSquare();

                // }
            }
        });
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });

    ws.on('error', (e) => {
        throw new Error(e.message);
    });

});