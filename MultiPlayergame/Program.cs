using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.SignalR;


var builder = WebApplication.CreateBuilder(args);

// 註冊服務
builder.Services.AddRazorPages(); // 允許使用 Razor Pages
builder.Services.AddSignalR() // 註冊 SignalR 服務
    .AddAzureSignalR(builder.Configuration["AzureSignalRConnectionString"]); // 設定 Azure SignalR 連接

var app = builder.Build();

// 配置 HTTP 請求管道
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error"); // 生產環境的錯誤處理
    app.UseHsts(); // 啟用 HSTS
}

app.UseHttpsRedirection(); // 重定向 HTTP 到 HTTPS
app.UseStaticFiles(); // 允許提供靜態文件（如 HTML, CSS, JS）

app.UseRouting(); // 啟用路由功能

app.UseAuthorization(); // 启用授權

// 設定預設頁面為 index.html
app.MapGet("/", async context =>
{
    context.Response.Redirect("/index.html");
});

// 加入 SignalR Hub 的路由配置
app.MapHub<MultiPlayerHub>("/Hubs/MultiPlayerHub");

// 當找不到其他路由時回到 index.html
app.MapFallbackToFile("index.html");

app.Run(); // 啟動應用
