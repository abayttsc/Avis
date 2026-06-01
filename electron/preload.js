import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendSMS: (data) => ipcRenderer.invoke('send-sms', data),
});
