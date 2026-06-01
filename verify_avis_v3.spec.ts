import { test, expect } from '@playwright/test';

test('verify dashboard with data', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Inject mock data into localStorage
  await page.evaluate(() => {
    const mockVehicles = [
      {
        id: '1',
        customerName: 'Test Driver',
        phone: '0912345678',
        plateNumber: 'AA12345',
        chassisNumber: 'CH123',
        motorNumber: 'MO123',
        vehicleType: 'Private',
        seatingCapacity: 5,
        registrationDate: new Date().toISOString().split('T')[0],
        expiryDate: '2026-06-01',
        certificateNumber: 'CERT123',
        fileLocation: 'Addis',
        visualResult: 'Pass',
        notes: 'Clean',
        status: 'Valid',
        lastUpdated: Date.now()
      }
    ];
    localStorage.setItem('avis_vehicles', JSON.stringify(mockVehicles));
  });

  await page.reload();

  // Wait for the chart to render or just wait a bit
  await page.waitForTimeout(2000);

  await page.screenshot({ path: '/home/jules/verification/dashboard_with_data.png', fullPage: true });
});

test('verify renewal modal', async ({ page }) => {
  await page.goto('http://localhost:5173/registration');

  // Inject mock data
  await page.evaluate(() => {
    const mockVehicles = [
      {
        id: '1',
        customerName: 'Duplicate User',
        phone: '0912345678',
        plateNumber: 'DUPE123',
        chassisNumber: 'CH123',
        motorNumber: 'MO123',
        vehicleType: 'Private',
        seatingCapacity: 5,
        registrationDate: '2024-01-01',
        expiryDate: '2025-01-01',
        certificateNumber: 'CERT123',
        fileLocation: 'Addis',
        visualResult: 'Pass',
        notes: 'Clean',
        status: 'Valid',
        lastUpdated: Date.now()
      }
    ];
    localStorage.setItem('avis_vehicles', JSON.stringify(mockVehicles));
  });

  await page.reload();

  // Type duplicate plate
  await page.fill('input[name="plateNumber"]', 'DUPE123');

  // Wait for modal
  await page.waitForSelector('text=Renewal Workflow');

  await page.screenshot({ path: '/home/jules/verification/renewal_modal.png', fullPage: true });
});
