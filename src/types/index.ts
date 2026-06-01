export type VehicleStatus = 'Valid' | 'Pending' | 'Critical' | 'Expired' | 'Suspended';

export interface Vehicle {
  id: string;
  customerName: string;
  phone: string;
  plateNumber: string; // Unique Key
  chassisNumber: string;
  motorNumber: string;
  vehicleType: string;
  seatingCapacity: number;
  registrationDate: string;
  expiryDate: string;
  notes: string;
  status: VehicleStatus;
  lastUpdated: number;
}

export interface AppSettings {
  stationName: string;
  stationLogo?: string;
  theme: 'light' | 'dark';
  language: 'en' | 'am';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  gatewayEnabled: boolean;
}

export interface SyncState {
  lastSync: number;
  isOnline: boolean;
}
