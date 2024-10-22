const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const PLAYER_SIZE = 20; // 玩家方塊的大小
let players = {}; // 用來存儲所有玩家的資料
let connectionId; // 用來儲存當前玩家的連接 ID

// 繪製所有玩家
function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
    for (const playerId in players) {
        const player = players[playerId];
        ctx.fillStyle = playerId === connectionId ? 'blue' : 'red'; // 自己的玩家是藍色，其他玩家是紅色
        ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE); // 繪製方塊
    }
}

// 前端的 SignalR 客戶端配置
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5056/Hubs/MultiPlayerHub")  // 使用完整 URL
    .build();


// 啟動連接
connection.start().then(() => {
    console.log("SignalR connection established");
}).catch(err => console.error("Error while starting connection: " + err));


// 監聽從伺服器發送過來的玩家列表更新
connection.on("UpdatePlayers", (updatedPlayers) => {
    console.log("收到玩家更新:", updatedPlayers); // 顯示接收到的玩家資料
    players = {}; // 清空現有的玩家資料

    // 更新玩家列表
    updatedPlayers.forEach(player => {
        players[player.id] = player; // 存儲每個玩家的信息
    });

    // 顯示當前玩家數量
    const playerCount = updatedPlayers.length;
    console.log("當前玩家數量: " + playerCount);

    drawPlayers(); // 繪製玩家
});




async function startGame() {
    try {
        await connection.start();
        connectionId = connection.connectionId; // 獲取當前玩家的連接 ID
        await connection.invoke("JoinGame"); // 發送加入遊戲請求
        console.log("成功連接到 SignalR！");
    } catch (err) {
        console.error(err);
        setTimeout(startGame, 5000); // 如果連接失敗，5秒後重試
    }
}


// 處理玩家移動
function movePlayer(direction) {
    if (!players[connectionId]) return; // 如果當前玩家不存在則不處理

    // 根據方向更新玩家位置
    switch (direction) {
        case "up":
            if (players[connectionId].y > 0) players[connectionId].y -= PLAYER_SIZE;
            break;
        case "down":
            if (players[connectionId].y < canvas.height - PLAYER_SIZE) players[connectionId].y += PLAYER_SIZE;
            break;
        case "left":
            if (players[connectionId].x > 0) players[connectionId].x -= PLAYER_SIZE;
            break;
        case "right":
            if (players[connectionId].x < canvas.width - PLAYER_SIZE) players[connectionId].x += PLAYER_SIZE;
            break;
    }

    drawPlayers(); // 更新畫面
    connection.invoke("MovePlayer", direction); // 通知伺服器該玩家移動了
}

// 處理鍵盤事件來控制玩家
document.addEventListener("keydown", (event) => {
    let direction = null;
    switch (event.key) {
        case "ArrowUp":
        case "w":
            direction = "up";
            break;
        case "ArrowDown":
        case "s":
            direction = "down";
            break;
        case "ArrowLeft":
        case "a":
            direction = "left";
            break;
        case "ArrowRight":
        case "d":
            direction = "right";
            break;
    }
    if (direction) {
        movePlayer(direction); // 根據鍵盤事件來移動玩家
    }
});

// 開始遊戲
startGame();
