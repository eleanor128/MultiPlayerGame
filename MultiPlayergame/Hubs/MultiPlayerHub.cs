using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

public class MultiPlayerHub : Hub
{
    private static ConcurrentDictionary<string, Player> players = new ConcurrentDictionary<string, Player>();

    public async Task JoinGame()
    {
        var playerId = Context.ConnectionId;
        var player = new Player { Id = playerId, X = 100, Y = 100 }; // 初始位置
        players[playerId] = player;

        await Clients.All.SendAsync("UpdatePlayers", players.Values);
    }

    public async Task MovePlayer(string direction)
    {
        var playerId = Context.ConnectionId;

        if (players.TryGetValue(playerId, out var player))
        {
            // 更新位置
            switch (direction)
            {
                case "up": player.Y -= 10; break;
                case "down": player.Y += 10; break;
                case "left": player.X -= 10; break;
                case "right": player.X += 10; break;
            }

            await Clients.All.SendAsync("UpdatePlayers", players.Values);
        }
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        players.TryRemove(Context.ConnectionId, out _);
        return base.OnDisconnectedAsync(exception);
    }
}

public class Player
{
    public string Id { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
}
