import path from 'path'
import { BrowserView, Tray, app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
const Store = require("electron-store");

const isProd = process.env.NODE_ENV === 'production'
const trayIconPath = path.join(app.getAppPath(), 'assets', "icon", 'icons8-chat-16.png');
const store = new Store();
let mainWindow = null;
let urlView = null;
let webView = null;
let tray = null;

function ensureHttp(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // 如果url以'http://'或'https://'开头，不做修改直接返回
    return url;
  } else {
    // 否则，在url前添加'http://'
    return 'http://' + url;
  }
}

const ResetLayout = (mainWindow, urlView, webView) => {
  let [width, height] = mainWindow.getSize();
  var splitx = 800;
  var splity = 600;
  if (isProd) {
    splitx = 100;
    splity = 40;
  }
  // 左右
  // urlView.setBounds({ x: 0, y: 0, width: splitx, height: height });
  // webView.setBounds({ x: splitx, y: 0, width: width - splitx, height: height });
  // 上下
  urlView.setBounds({ x: 0, y: 0, width: width, height: splity });
  webView.setBounds({ x: 0, y: splity, width: width, height: height - splity });

}

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()
  let { width, height, x, y } = store.get("winBounds", {
    width: 800,
    height: 600,
  }); 
  mainWindow = createWindow('main', {
    width: width,
    height: height,
    show: false, // 初始不显示窗口
    frame: false,
    resizable: true, // 窗口大小调整
    movable: false, // 禁止窗口移动
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.on("close", () => {
    store.set("winBounds", mainWindow.getBounds());
  });
  // 创建两个 BrowserView 实例
  urlView = new BrowserView(
  {
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 指定 preload 脚本的路径
      contextIsolation: true, // 推荐为 true 以确保安全
    },
  });
  webView = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 指定 preload 脚本的路径
      contextIsolation: true, // 推荐为 true 以确保安全
    },
  });

  mainWindow.addBrowserView(urlView);
  mainWindow.addBrowserView(webView);
  // let [width, height] = mainWindow.getSize();
  // 假设这里是第 5883 行，确保这里没有类型转换错误
  // const splitx = Math.floor(width / 2);
  // const splitx = 800;
  // const splity = 500;
  // 左右
  // urlView.setBounds({ x: 0, y: 0, width: splitx, height: height });
  // webView.setBounds({ x: splitx, y: 0, width: width - splitx, height: height });
  // 上下
//   urlView.setBounds({ x: 0, y: 0, width: width, height: splity });
// webView.setBounds({ x: 0, y: splity, width: width, height: height - splity });

  ResetLayout(mainWindow, urlView, webView);

  // urlView.setBounds({ x: 0, y: 0, width: mainWindow.getBounds().width / 2, height: mainWindow.getBounds().height });
  // webView.setBounds({ x: mainWindow.getBounds().width / 2, y: 0, width: mainWindow.getBounds().width / 2, height: mainWindow.getBounds().height });
  // urlView.webContents.loadURL('https://example.com'); // 加载你想要显示的 URL
  if (isProd) {
    await urlView.webContents.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await urlView.webContents.loadURL(`http://localhost:${port}/home`)
    urlView.webContents.openDevTools()
  }

  webView.webContents.on('did-finish-load', () => {
    // 页面加载完成后获取当前页面的URL
    const currentUrl = webView.webContents.getURL();
    console.log('send reply_url :', currentUrl);
    urlView.webContents.send('reply_url', currentUrl);
  });
  webView.webContents.on('did-navigate', (event, url) => {
    // console.log('Navigated to:', url);
  });

  // 监听页面内导航的事件（如hash改变）
  webView.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
    // console.log('Navigated in-page to:', url, 'Is main frame:', isMainFrame);
  });

  await webView.webContents.loadURL('https://www.juchats.com/chat'); // 加载另一个你想要显示的 URL

  // 监听窗口大小变化以调整视图大小
  mainWindow.on('resize', () => {
    // let [width, height] = mainWindow.getSize();
  // 假设这里是第 5883 行，确保这里没有类型转换错误
    // const splitx = Math.floor(width / 2);
    // const splitx = 200;
      // urlView.setBounds({ x: 0, y: 0, width: splitx, height: height });
      // webView.setBounds({ x: splitx, y: 0, width: width - splitx, height: height });
      ResetLayout(mainWindow, urlView, webView);
  });
  tray = new Tray(trayIconPath); // 设置托盘图标的路径
  tray.setToolTip("chatchat");
  tray.on("click", () => {
    if (!mainWindow.isVisible() || !mainWindow.isFocused()) {
      const trayBounds = tray.getBounds(); // 获取托盘图标的位置和尺寸

      // 计算窗口的 x 和 y 位置
      const windowBounds = mainWindow.getBounds();
      let x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
      );
      let y = Math.round(trayBounds.y + trayBounds.height);

      // 设置窗口的位置
      mainWindow.setPosition(x, y, false);
      mainWindow.show(); // 显示窗口
      // 设置窗口为最顶层，但不是始终在最顶层
      mainWindow.setAlwaysOnTop(true);
      mainWindow.setAlwaysOnTop(false);
    } else {
      mainWindow.hide(); // 隐藏窗口
    }
  });

  // if (isProd) {
  //   await mainWindow.loadURL('app://./home')
  // } else {
  //   const port = process.argv[2]
  //   await mainWindow.loadURL(`http://localhost:${port}/home`)
  //   mainWindow.webContents.openDevTools()
  // }
})()

app.on('window-all-closed', () => {
  app.quit()
})
ipcMain.on("reply_url", (event, url) => {
  // console.log("electron recevie reply_url:", url)
})

ipcMain.on('current_url', async (event, arg) => {
  const obj = JSON.parse(arg);

  const http_url = ensureHttp(obj.url);
  // event.reply('current_url', `${obj} World!`);
  webView.webContents.loadURL(http_url);
})
