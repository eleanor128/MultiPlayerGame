using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace MultiPlayergame.Hubs
{
    public class MultiPlayerHub : Hub
    {
        // 當玩家移動時呼叫此方法
        public async Task MovePlayer(int x, int y)
        {
            // 向其他玩家發送移動的座標
            await Clients.Others.SendAsync("PlayerMoved", Context.ConnectionId, x, y);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Others.SendAsync("NewPlayer", Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            await Clients.Others.SendAsync("PlayerDisconnected", Context.ConnectionId);
        }
    }
}
