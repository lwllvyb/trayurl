const { app, Tray, Menu, BrowserWindow } = require("electron");
const path = require("path");
const trayIconPath = path.join(app.getAppPath(), 'assets', "icon", 'icons8-chat-16.png');
const Store = require("electron-store");
const store = new Store();
let tray = null;
let win = null;

app.whenReady().then(() => {
  tray = new Tray(trayIconPath); // 设置托盘图标的路径
  tray.setToolTip("您的应用名称");
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: "退出", type: "normal", role: "quit" },
  // ]);
  // tray.setContextMenu(contextMenu);

  let { width, height, x, y } = store.get("winBounds", {
    width: 800,
    height: 600,
  });
  win = new BrowserWindow({
    width: width,
    height: height,
    show: false, // 初始不显示窗口
    frame: false,
    resizable: true, // 窗口大小调整
    movable: false, // 禁止窗口移动
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL("https://www.juchats.com/chat"); // 加载页面
  win.on("close", () => {
    store.set("winBounds", win.getBounds());
  });

  // 可以选择在这里创建一个 BrowserWindow 实例，但不立即显示
  tray.on("click", () => {
    if (!win.isVisible() || !win.isFocused()) {
      const trayBounds = tray.getBounds(); // 获取托盘图标的位置和尺寸

      // 计算窗口的 x 和 y 位置
      const windowBounds = win.getBounds();
      let x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
      );
      let y = Math.round(trayBounds.y + trayBounds.height);

      // 设置窗口的位置
      win.setPosition(x, y, false);
      win.show(); // 显示窗口
      // 设置窗口为最顶层，但不是始终在最顶层
      win.setAlwaysOnTop(true);
      win.setAlwaysOnTop(false);
    } else {
      win.hide(); // 隐藏窗口
    }
  });
});
