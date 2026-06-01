import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: "Abay Technical Vehicle Inspection System (AVIS)",
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  ipcMain.handle('send-sms', async (event, data) => {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../python_bridge/sms_bridge.py');
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      const pythonProcess = spawn(pythonCmd, [scriptPath]);

      pythonProcess.stdin.write(JSON.stringify(data));
      pythonProcess.stdin.end();

      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`SMS Bridge Error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve({ success: true, message: 'SMS logic executed' });
          }
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
