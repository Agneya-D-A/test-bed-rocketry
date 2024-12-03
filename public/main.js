const {app, BrowserWindow} = require('electron');

let wind;

function createWindow(){
    wind = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'rocketry_icon.ico',
        webPreferences: {
            nodeIntegration: true,  // For accessing Node.js APIs if needed
            contextIsolation: false,
        }
    });

    wind.loadURL('http://localhost:3000');

    wind.on('closed',()=>{
        wind = null;
    })
}

app.on('ready',()=>{
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
app.on('activate', () => {
    if (wind === null) {
        createWindow();
    }
});