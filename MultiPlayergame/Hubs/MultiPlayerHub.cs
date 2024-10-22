using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

public class MultiPlayerHub : Hub
{
    private static Dictionary<string, Player> players = new();

    // 當玩家加入遊戲時
    public async Task JoinGame()
    {
        var playerId = Context.ConnectionId;
        players[playerId] = new Player { Id = playerId, X = 400, Y = 300 };
        await Clients.All.SendAsync("UpdatePlayers", players.Values);
        Console.WriteLine($"Player {playerId} joined at position (400, 300)");
    }

    // 當玩家移動時
    public async Task MovePlayer(string direction)
    {
        var playerId = Context.ConnectionId;

        if (players.TryGetValue(playerId, out var player))
        {
            switch (direction)
            {
                case "up":
                    player.Y -= 20;
                    break;
                case "down":
                    player.Y += 20;
                    break;
                case "left":
                    player.X -= 20;
                    break;
                case "right":
                    player.X += 20;
                    break;
            }

            // 廣播所有玩家的位置更新
            await Clients.All.SendAsync("UpdatePlayers", players.Values);
        }
    }

    // 當玩家斷開連接時
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var playerId = Context.ConnectionId;
        players.Remove(playerId);
        await Clients.All.SendAsync("UpdatePlayers", players.Values); // 更新玩家列表
        await base.OnDisconnectedAsync(exception);
    }


    // 玩家資料類
    public class Player
    {
        public required string Id { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
    }


}
