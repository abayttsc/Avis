import type { AppSettings, Vehicle } from '../types';
import { detectCarrier } from './carrierUtils';

declare global {
  interface Window {
    electronAPI?: {
      sendSMS: (payload: any) => void;
    };
  }
}

export const sendSMSTrigger = async (vehicle: Vehicle, settings: AppSettings) => {
  const { gateway, carrier } = detectCarrier(vehicle.phone);

  if (carrier === 'Unknown') {
    console.error("Unknown carrier for phone:", vehicle.phone);
    return;
  }

  const messageBody = settings.smsTemplate
    .replace('[NAME]', vehicle.customerName)
    .replace('[PLATE]', vehicle.plateNumber)
    .replace('[DATE]', vehicle.expiryDate)
    .replace('[CERT]', vehicle.certificateNumber);

  const payload = {
    config: {
      host: settings.smtpHost,
      port: settings.smtpPort,
      user: settings.smtpUser,
      pass: settings.smtpPass
    },
    recipient: gateway,
    body: messageBody
  };

  console.log("AVIS SMS Trigger Payload:", payload);

  // In Electron environment, we use IPC to call the Python bridge.
  if (window.electronAPI) {
    try {
      await window.electronAPI.sendSMS(payload);
    } catch (err) {
      console.error("Failed to send SMS via Electron bridge:", err);
    }
  }
};
