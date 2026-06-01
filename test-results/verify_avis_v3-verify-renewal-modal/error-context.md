# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verify_avis_v3.spec.ts >> verify renewal modal
- Location: verify_avis_v3.spec.ts:39:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Renewal Workflow') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - img "AVIS Logo" [ref=e9]
      - generic [ref=e10]:
        - heading "ABAY" [level=1] [ref=e11]
        - paragraph [ref=e12]: Technical Inspection
    - navigation [ref=e14]:
      - link "Dashboard" [ref=e15] [cursor=pointer]:
        - /url: /dashboard
        - img [ref=e16]
        - generic [ref=e21]: Dashboard
      - link "Registration" [ref=e22] [cursor=pointer]:
        - /url: /registration
        - img [ref=e23]
        - generic [ref=e26]: Registration
      - link "Reporting" [ref=e27] [cursor=pointer]:
        - /url: /reporting
        - img [ref=e28]
        - generic [ref=e31]: Reporting
      - link "Settings" [ref=e32] [cursor=pointer]:
        - /url: /settings
        - img [ref=e33]
        - generic [ref=e36]: Settings
    - button "Logout" [ref=e38]:
      - img [ref=e39]
      - generic [ref=e42]: Logout
  - main [ref=e43]:
    - generic [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]: Section /
        - heading "Management Core" [level=2] [ref=e47]
      - generic [ref=e48]:
        - generic [ref=e51]: System Online
        - generic [ref=e53]: JD
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img [ref=e61]
          - heading "Customer Registration" [level=1] [ref=e64]
        - paragraph [ref=e65]: AVIS CORE IDENTITY MANAGEMENT
      - generic [ref=e66]:
        - generic [ref=e67]:
          - generic [ref=e68]:
            - img [ref=e69]
            - heading "Identity Profile" [level=2] [ref=e72]
          - generic [ref=e73]:
            - generic [ref=e74]:
              - generic [ref=e75]: Phone Number
              - generic [ref=e76]:
                - img [ref=e77]
                - textbox "+251 . . ." [ref=e79]
            - generic [ref=e80]:
              - generic [ref=e81]: Full Customer Name
              - generic [ref=e82]:
                - img [ref=e83]
                - textbox "Enter legal name" [ref=e86]
        - generic [ref=e87]:
          - img [ref=e89]
          - generic [ref=e94]:
            - img [ref=e95]
            - heading "Machine Specs" [level=2] [ref=e100]
          - generic [ref=e101]:
            - generic [ref=e102]:
              - generic [ref=e103]: Plate Number (Identification Key)
              - generic [ref=e104]:
                - img [ref=e105]
                - textbox "AA 12345" [active] [ref=e108]: DUPE123
            - generic [ref=e109]:
              - generic [ref=e110]:
                - generic [ref=e111]: Vehicle Type
                - generic [ref=e112]:
                  - combobox [ref=e113]:
                    - option "Select Category" [disabled]
                    - option "Private" [selected]
                    - option "Commercial"
                    - option "Public Transport"
                    - option "Truck / Heavy"
                  - img
              - generic [ref=e114]:
                - generic [ref=e115]: Seating Capacity
                - generic [ref=e116]:
                  - img [ref=e117]
                  - spinbutton [ref=e120]: "4"
                  - generic [ref=e121]:
                    - button "-" [ref=e122]
                    - button "+" [ref=e123]
            - generic [ref=e124]:
              - generic [ref=e125]:
                - generic [ref=e126]: Chassis Number
                - generic [ref=e127]:
                  - img [ref=e128]
                  - textbox "CH-XXXXXX" [ref=e131]
              - generic [ref=e132]:
                - generic [ref=e133]: Motor Number
                - generic [ref=e134]:
                  - img [ref=e135]
                  - textbox "MOT-XXXXXX" [ref=e138]
        - generic [ref=e139]:
          - generic [ref=e140]:
            - img [ref=e141]
            - heading "Technical Assessment" [level=2] [ref=e144]
          - generic [ref=e145]:
            - generic [ref=e146]:
              - generic [ref=e147]: Certificate Number
              - generic [ref=e148]:
                - img [ref=e149]
                - textbox "CERT-XXXX" [ref=e152]
            - generic [ref=e153]:
              - generic [ref=e154]: Registration Date
              - textbox [ref=e156]: 2026-06-01
            - generic [ref=e157]:
              - generic [ref=e158]: File Location / Address
              - generic [ref=e159]:
                - img [ref=e160]
                - textbox "Cabinet A / Addis Ababa" [ref=e164]
          - generic [ref=e165]:
            - generic [ref=e166]:
              - generic [ref=e167]: Visual Result
              - generic [ref=e168]:
                - button "PASS" [ref=e169]:
                  - img [ref=e170]
                  - text: PASS
                - button "FAIL" [ref=e173]:
                  - img [ref=e174]
                  - text: FAIL
            - generic [ref=e178]:
              - generic [ref=e179]: Observations / Technical Notes
              - generic [ref=e180]:
                - img [ref=e181]
                - textbox "Enter detailed technical observations..." [ref=e183]
            - generic [ref=e184]:
              - generic [ref=e185]:
                - paragraph [ref=e186]: Auto-Calculated Expiry
                - paragraph [ref=e187]: 2027-06-01
              - img [ref=e189]
            - generic [ref=e191]:
              - paragraph [ref=e192]: Visual Proof / Plate Scan
              - button "Capture Plate Photo" [ref=e193]:
                - img [ref=e195]
                - generic [ref=e198]: Capture Plate Photo
        - generic [ref=e199]:
          - generic [ref=e200]:
            - img [ref=e201]
            - heading "Messaging Template" [level=2] [ref=e203]
          - generic [ref=e204]:
            - generic [ref=e205]:
              - paragraph [ref=e206]: Notification Template
              - generic [ref=e207]: "Dear Customer, your vehicle inspection for {PLATE} is complete. Valid until {EXPIRY}."
            - generic [ref=e208]:
              - paragraph [ref=e209]: Preview (EN/AM)
              - generic [ref=e210]:
                - paragraph [ref=e211]: Dear Customer, your vehicle inspection for DUPE123 is complete. Valid until 2027-06-01.
                - paragraph [ref=e212]: ውድ ደንበኛ፣ የሰሌዳ ቁጥር DUPE123 ተሽከርካሪ ምርመራ ተጠናቋል፡፡ እስከ 2027-06-01 ድረስ ያገለግላል፡፡
        - generic [ref=e213]:
          - button "Confirm & Finalize Inspection" [ref=e214]:
            - img [ref=e215]
            - generic [ref=e219]: Confirm & Finalize Inspection
          - button "Discard and reset entries" [ref=e220]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('verify dashboard with data', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  |
  6  |   // Inject mock data into localStorage
  7  |   await page.evaluate(() => {
  8  |     const mockVehicles = [
  9  |       {
  10 |         id: '1',
  11 |         customerName: 'Test Driver',
  12 |         phone: '0912345678',
  13 |         plateNumber: 'AA12345',
  14 |         chassisNumber: 'CH123',
  15 |         motorNumber: 'MO123',
  16 |         vehicleType: 'Private',
  17 |         seatingCapacity: 5,
  18 |         registrationDate: new Date().toISOString().split('T')[0],
  19 |         expiryDate: '2026-06-01',
  20 |         certificateNumber: 'CERT123',
  21 |         fileLocation: 'Addis',
  22 |         visualResult: 'Pass',
  23 |         notes: 'Clean',
  24 |         status: 'Valid',
  25 |         lastUpdated: Date.now()
  26 |       }
  27 |     ];
  28 |     localStorage.setItem('avis_vehicles', JSON.stringify(mockVehicles));
  29 |   });
  30 |
  31 |   await page.reload();
  32 |
  33 |   // Wait for the chart to render or just wait a bit
  34 |   await page.waitForTimeout(2000);
  35 |
  36 |   await page.screenshot({ path: '/home/jules/verification/dashboard_with_data.png', fullPage: true });
  37 | });
  38 |
  39 | test('verify renewal modal', async ({ page }) => {
  40 |   await page.goto('http://localhost:5173/registration');
  41 |
  42 |   // Inject mock data
  43 |   await page.evaluate(() => {
  44 |     const mockVehicles = [
  45 |       {
  46 |         id: '1',
  47 |         customerName: 'Duplicate User',
  48 |         phone: '0912345678',
  49 |         plateNumber: 'DUPE123',
  50 |         chassisNumber: 'CH123',
  51 |         motorNumber: 'MO123',
  52 |         vehicleType: 'Private',
  53 |         seatingCapacity: 5,
  54 |         registrationDate: '2024-01-01',
  55 |         expiryDate: '2025-01-01',
  56 |         certificateNumber: 'CERT123',
  57 |         fileLocation: 'Addis',
  58 |         visualResult: 'Pass',
  59 |         notes: 'Clean',
  60 |         status: 'Valid',
  61 |         lastUpdated: Date.now()
  62 |       }
  63 |     ];
  64 |     localStorage.setItem('avis_vehicles', JSON.stringify(mockVehicles));
  65 |   });
  66 |
  67 |   await page.reload();
  68 |
  69 |   // Type duplicate plate
  70 |   await page.fill('input[name="plateNumber"]', 'DUPE123');
  71 |
  72 |   // Wait for modal
> 73 |   await page.waitForSelector('text=Renewal Workflow');
     |              ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  74 |
  75 |   await page.screenshot({ path: '/home/jules/verification/renewal_modal.png', fullPage: true });
  76 | });
  77 |
```