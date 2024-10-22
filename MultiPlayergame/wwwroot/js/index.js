const connection = new signalR.HubConnectionBuilder()
    .withUrl("/Hubs")
    .build();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const playerSize = 20;
let player = { x: Math.random() * (canvas.width - playerSize), y: Math.random() * (canvas.height - playerSize) }; // 玩家初始位置

// 畫出玩家的方塊
function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
    ctx.fillStyle = "blue"; // 玩家方塊顏色
    ctx.fillRect(player.x, player.y, playerSize, playerSize);
}

// 畫出其他玩家的方塊
const otherPlayers = {}; // 用於儲存其他玩家的位置

function drawOtherPlayer(connectionId, x, y) {
    ctx.fillStyle = "red"; // 其他玩家方塊顏色
    ctx.fillRect(x, y, playerSize, playerSize);
}

// 監聽鍵盤事件來移動玩家
window.addEventListener("keydown", async (event) => {
    switch (event.key) {
        case "ArrowUp":
            player.y -= 5;
            break;
        case "ArrowDown":
            player.y += 5;
            break;
        case "ArrowLeft":
            player.x -= 5;
            break;
        case "ArrowRight":
            player.x += 5;
            break;
    }

    // 畫出自己的方塊
    drawPlayer();

    // 通知其他玩家自己移動的座標
    await connection.invoke("MovePlayer", player.x, player.y);
});

// 接收其他玩家移動的座標
connection.on("PlayerMoved", (connectionId, x, y) => {
    otherPlayers[connectionId] = { x, y };
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布

    // 畫出自己的方塊
    drawPlayer();

    // 畫出其他玩家的方塊
    for (const id in otherPlayers) {
        drawOtherPlayer(id, otherPlayers[id].x, otherPlayers[id].y);
    }
});

// 接收新玩家連接的通知
connection.on("NewPlayer", (connectionId) => {
    otherPlayers[connectionId] = { x: Math.random() * (canvas.width - playerSize), y: Math.random() * (canvas.height - playerSize) }; // 隨機位置
});

// 接收玩家斷開的通知
connection.on("PlayerDisconnected", (connectionId) => {
    delete otherPlayers[connectionId];
});

// 啟動 SignalR 連接
async function startConnection() {
    try {
        await connection.start(); // 嘗試啟動連接
        drawPlayer(); // 畫出玩家的方塊
    } catch (err) {
        console.error(err);
    }
}

// 停止連接的函數
async function stopConnection() {
    try {
        if (connection.state !== signalR.HubConnectionState.Disconnected) {
            await connection.stop(); // 停止當前的連接
        }
    } catch (err) {
        console.error("Error stopping connection: ", err);
    }
}

// 初始化連接
async function initialize() {
    await stopConnection(); // 確保當前連接已經停止
    await startConnection(); // 然後啟動新的連接
}

// 初始化連接
initialize();
