/**
 * Ethiopian Carrier Detection and Normalization Logic
 */

export type Carrier = 'EthioTelecom' | 'Safaricom' | 'Unknown';

export interface CarrierInfo {
  carrier: Carrier;
  gateway: string;
  normalizedNumber: string;
}

export const detectCarrier = (phone: string): CarrierInfo => {
  // Remove all non-numeric characters
  let cleanNumber = phone.replace(/\D/g, '');

  // Handle +251 prefix
  if (cleanNumber.startsWith('251')) {
    cleanNumber = '0' + cleanNumber.substring(3);
  }

  // Carrier Gateways (Placeholders as per spec)
  const ETHIO_GATEWAY = 'sms.ethiotelecom.et';
  const SAFARICOM_GATEWAY = 'sms.safaricom.et';

  let carrier: Carrier = 'Unknown';
  let gateway = '';

  if (cleanNumber.startsWith('09')) {
    carrier = 'EthioTelecom';
    gateway = `${cleanNumber}@${ETHIO_GATEWAY}`;
  } else if (cleanNumber.startsWith('07')) {
    carrier = 'Safaricom';
    gateway = `${cleanNumber}@${SAFARICOM_GATEWAY}`;
  }

  return {
    carrier,
    gateway,
    normalizedNumber: cleanNumber
  };
};
