const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const PLAYER_SIZE = 20; // 玩家方塊的大小
let player = {
    x: canvas.width / 2 - PLAYER_SIZE / 2, // 初始 X 坐標
    y: canvas.height / 2 - PLAYER_SIZE / 2, // 初始 Y 坐標
};

function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
    ctx.fillStyle = 'blue'; // 方塊顏色
    ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE); // 繪製方塊
}

function movePlayer(direction) {
    switch (direction) {
        case "up":
            if (player.y > 0) player.y -= PLAYER_SIZE; // 向上移動
            break;
        case "down":
            if (player.y < canvas.height - PLAYER_SIZE) player.y += PLAYER_SIZE; // 向下移動
            break;
        case "left":
            if (player.x > 0) player.x -= PLAYER_SIZE; // 向左移動
            break;
        case "right":
            if (player.x < canvas.width - PLAYER_SIZE) player.x += PLAYER_SIZE; // 向右移動
            break;
    }
    drawPlayer(); // 每次移動後重繪
}

// 處理鍵盤事件以移動玩家方塊
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
        movePlayer(direction);
    }
});

// 初始繪製玩家
drawPlayer();
