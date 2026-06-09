export const COMPONENTS_DB = [
  // --- FLIGHT CONTROLLERS ---
  {
    id: "fc-speedybee-f405-v4",
    category: "Flight Controller",
    name: "SpeedyBee F405 V4 Stack",
    brand: "SpeedyBee",
    price: 69.99,
    url: "https://www.newegg.com/p/pl?d=SpeedyBee+F405",
    specs: { uarts: 6, weight: 10.5, firmware: "Betaflight/ArduPilot" }
  },
  {
    id: "fc-matek-h743-wingv3",
    category: "Flight Controller",
    name: "Matek H743-WING V3 (Fixed Wing Focus)",
    brand: "Matek Systems",
    price: 114.00,
    url: "https://www.newegg.com/p/pl?d=Matek+H743",
    specs: { uarts: 8, weight: 30.0, firmware: "ArduPilot/iNav" }
  },

  // --- ESCs ---
  {
    id: "esc-speedybee-55a-4in1",
    category: "ESC",
    name: "SpeedyBee 55A BLHeli_S 4-in-1",
    brand: "SpeedyBee",
    price: 45.00,
    url: "https://www.newegg.com/p/pl?d=SpeedyBee+ESC",
    specs: { max_amps: 55, bec_amps: 0, protocols: ["DShot300", "DShot600"] }
  },
  {
    id: "esc-apu-airplane-60a",
    category: "ESC",
    name: "APU Fixed-Wing 60A SBEC",
    brand: "Hobbywing",
    price: 38.00,
    url: "https://www.newegg.com/p/pl?d=Hobbywing+60A+ESC",
    specs: { max_amps: 60, bec_amps: 5.0, protocols: ["PWM"] }
  },

  // --- MOTORS ---
  {
    id: "motor-tmotor-velox-2207",
    category: "Motor",
    name: "T-Motor Velox V2 2207 (1950KV)",
    brand: "T-Motor",
    price: 16.90,
    url: "https://www.newegg.com/p/pl?d=T-Motor+2207",
    specs: { max_current: 38.5, weight: 32.1, cell_min: 4, cell_max: 6 }
  },
  {
    id: "motor-sunnysky-2216",
    category: "Motor",
    name: "SunnySky X2216 1250KV (Fixed Wing)",
    brand: "SunnySky",
    price: 24.00,
    url: "https://www.newegg.com/p/pl?d=SunnySky+2216",
    specs: { max_current: 30.0, weight: 68.0, cell_min: 3, cell_max: 4 }
  },

  // --- BATTERIES ---
  {
    id: "bat-cnhl-1500-4s",
    category: "Battery",
    name: "CNHL Black Series 1500mAh 4S 100C",
    brand: "CNHL",
    price: 19.99,
    url: "https://www.newegg.com/p/pl?d=CNHL+4S+Battery",
    specs: { cells: 4, capacity: 1500, c_rating: 100 }
  },
  {
    id: "bat-ovonic-5000-6s",
    category: "Battery",
    name: "Ovonic 5000mAh 6S 50C LiPo",
    brand: "Ovonic",
    price: 65.00,
    url: "https://www.newegg.com/p/pl?d=6S+LiPo+Battery+5000mAh",
    specs: { cells: 6, capacity: 5000, c_rating: 50 }
  },

  // --- PERIPHERAL SENSORS ---
  {
    id: "sens-matek-m10q",
    category: "Sensor",
    name: "Matek M10Q-5883 GPS & Compass",
    brand: "Matek Systems",
    price: 42.00,
    url: "https://www.newegg.com/p/pl?d=Matek+GPS",
    specs: { uart_required: true, current_draw: 0.06 }
  },
  {
    id: "sens-pitot-digital",
    category: "Sensor",
    name: "ArduPilot Digital Airspeed Sensor (Pitot)",
    brand: "Holybro",
    price: 35.00,
    url: "https://www.newegg.com/p/pl?d=Digital+Airspeed+Sensor",
    specs: { uart_required: true, current_draw: 0.02 }
  },

  // --- SERVOS ---
  {
    id: "servo-mg90s",
    category: "Servo",
    name: "MG90S Micro Metal Gear Servo",
    brand: "TowerPro",
    price: 6.50,
    url: "https://www.newegg.com/p/pl?d=MG90S+Servo",
    specs: { current_draw: 0.8 }
  },

  // --- CAMERAS ---
  {
    id: "cam-caddx-ratel2",
    category: "Camera",
    name: "Caddx Ratel 2 Starlight FPV",
    brand: "Caddx",
    price: 28.99,
    url: "https://www.newegg.com/p/pl?d=Caddx+Ratel",
    specs: { video_system: "analog" }
  },
  {
    id: "cam-dji-o3",
    category: "Camera",
    name: "DJI O3 Air Unit Camera Module",
    brand: "DJI",
    price: 99.00,
    url: "https://www.newegg.com/p/pl?d=DJI+O3+Air+Unit",
    specs: { video_system: "digital" }
  },

  // --- VIDEO TRANSMITTERS (VTX) ---
  {
    id: "vtx-rush-tank",
    category: "VTX",
    name: "Rush Tank Solo 5.8GHz 1.6W",
    brand: "Rush FPV",
    price: 49.90,
    url: "https://www.newegg.com/p/pl?d=Rush+Tank+VTX",
    specs: { video_system: "analog" }
  },
  {
    id: "vtx-dji-o3-unit",
    category: "VTX",
    name: "DJI O3 Air Unit Transmission Module",
    brand: "DJI",
    price: 149.00,
    url: "https://www.newegg.com/p/pl?d=DJI+O3+Air+Unit",
    specs: { video_system: "digital" }
