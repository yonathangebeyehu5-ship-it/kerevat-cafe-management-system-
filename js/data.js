/* ==========================================================================
   RESTAURANT OS - INITIAL SEED DATA & PERSISTENT DATA MODELS
   ========================================================================== */

const INITIAL_RESTAURANT_DATA = {
  // Current System Metadata
  meta: {
    systemName: "RESTAURANT OS",
    tagline: "Run Your Restaurant. Control Every Operation.",
    currency: "ETB",
    taxRate: 0.15, // 15% VAT Ethiopia
    serviceChargeRate: 0.10, // 10% Service Charge
    activeBranch: "lideta",
    openingTime: "07:00 AM",
    businessDayStatus: "OPEN", // "OPEN" or "CLOSED"
    activeShift: {
      id: "SHIFT-104",
      cashier: "Bethlehem Tadesse",
      openingFloat: 10000,
      startTime: "07:30 AM"
    }
  },

  // Branch Directory - Exclusively Configured for Lideta Branch
  branches: [
    { id: "lideta", name: "Lideta Flagship", location: "Lideta Sub-City, Near Lideta Mall / Mexico, Addis Ababa", phone: "+251 11 550 1122", tables: 24, activeOrders: 12, todaySales: 48750 }
  ],

  // 16 Standard User Roles & Profiles
  roles: {
    owner: { title: "Owner / Executive", name: "Abebe Kebede", avatar: "AK", badge: "👑 Owner", permissions: ["ALL"] },
    general_manager: { title: "General Manager", name: "Dawit Mengistu", avatar: "DM", badge: "👔 GM", permissions: ["ALL_OPS", "APPROVE_PURCHASE", "REFUNDS"] },
    branch_manager: { title: "Branch Manager (Lideta)", name: "Rahel Solomon", avatar: "RS", badge: "🏢 BM", permissions: ["BRANCH_OPS", "DISCOUNTS", "SCHEDULES"] },
    supervisor: { title: "Shift Supervisor", name: "Kassahun Bekele", avatar: "KB", badge: "📋 Supervisor", permissions: ["FLOOR_CONTROL", "VOID_ITEMS"] },
    cashier: { title: "Cashier / POS", name: "Bethlehem Tadesse", avatar: "BT", badge: "💳 Cashier", permissions: ["POS_BILLING", "RECEIPTS", "PAYMENTS", "SHIFT_RECONCILE"] },
    waiter: { title: "Waiter / Server", name: "Ephrem Tefera", avatar: "ET", badge: "🍽️ Waiter", permissions: ["ORDER_TAKING", "TABLES", "BILL_REQUEST"] },
    chef: { title: "Executive Chef", name: "Chef Hailemariam", avatar: "CH", badge: "👨‍🍳 Chef", permissions: ["KDS_CONTROL", "KITCHEN_HOME", "ITEM_86_OUT"] },
    kitchen_staff: { title: "Kitchen Prep Staff", name: "Birtukan Worku", avatar: "BW", badge: "🍳 Kitchen Prep", permissions: ["KDS_VIEW", "KITCHEN_HOME"] },
    barista: { title: "Barista (Coffee Master)", name: "Solomon Getachew", avatar: "SG", badge: "☕ Barista", permissions: ["BARISTA_KDS", "COFFEE_ORDERS"] },
    bartender: { title: "Bartender / Mixologist", name: "Meklit Assefa", avatar: "MA", badge: "🍸 Bartender", permissions: ["BAR_KDS", "DRINK_ORDERS"] },
    storekeeper: { title: "Storekeeper / Inventory", name: "Tadesse Woldie", avatar: "TW", badge: "📦 Storekeeper", permissions: ["INVENTORY", "STOCK_RECEIPT", "STOCK_ISSUE"] },
    purchasing: { title: "Purchasing Officer", name: "Almaz Negash", avatar: "AN", badge: "🛒 Purchasing", permissions: ["PURCHASE_ORDERS", "SUPPLIERS"] },
    accountant: { title: "Accountant / Finance", name: "Henok Berhanu", avatar: "HB", badge: "📊 Finance", permissions: ["FINANCE_REPORTS", "EXPENSES", "AUDIT"] },
    hr: { title: "HR & Admin", name: "Tsion Hailu", avatar: "TH", badge: "👥 HR", permissions: ["STAFF_MGMT", "ATTENDANCE", "SHIFTS"] },
    delivery: { title: "Delivery Staff", name: "Natnael Desta", avatar: "ND", badge: "🛵 Delivery", permissions: ["DISPATCH_VIEW", "ROUTE_STATUS"] },
    cleaner: { title: "Cleaner & Maintenance", name: "Meseret Gizaw", avatar: "MG", badge: "🧹 Maintenance", permissions: ["CHECKLISTS", "MAINTENANCE_TICKETS"] }
  },

  // Complete Menu Catalog with Recipe Ingredient BOM
  menuItems: [
    {
      id: "prod-1",
      name: "Kerevat Special Burger",
      category: "Burgers",
      station: "Kitchen",
      price: 480,
      cost: 165,
      prepTime: 12,
      emoji: "🍔",
      description: "Char-grilled Ethiopian beef patty, cheddar, caramelized onions, house special sauce & crispy fries.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-beef", qty: 0.15, unit: "kg" },
        { ingredientId: "ing-bun", qty: 1, unit: "pcs" },
        { ingredientId: "ing-cheese", qty: 1, unit: "pcs" },
        { ingredientId: "ing-tomato", qty: 0.03, unit: "kg" },
        { ingredientId: "ing-onion", qty: 0.02, unit: "kg" },
        { ingredientId: "ing-fries", qty: 0.15, unit: "kg" }
      ]
    },
    {
      id: "prod-2",
      name: "Traditional Doro Wat Combo",
      category: "Ethiopian Food",
      station: "Kitchen",
      price: 650,
      cost: 230,
      prepTime: 15,
      emoji: "🥘",
      description: "Rich slow-cooked spicy chicken stew with hardboiled egg, homemade Ayib cheese & two Teff injera.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-chicken", qty: 0.25, unit: "kg" },
        { ingredientId: "ing-egg", qty: 2, unit: "pcs" },
        { ingredientId: "ing-berbere", qty: 0.04, unit: "kg" },
        { ingredientId: "ing-injera", qty: 2, unit: "pcs" },
        { ingredientId: "ing-butter", qty: 0.03, unit: "kg" }
      ]
    },
    {
      id: "prod-3",
      name: "Special Beef Tibs (Sizzling)",
      category: "Ethiopian Food",
      station: "Kitchen",
      price: 520,
      cost: 195,
      prepTime: 14,
      emoji: "🥩",
      description: "Tender cubed beef pan-sautéed with rosemary, red onions, garlic, green chilies, served sizzling.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-beef", qty: 0.25, unit: "kg" },
        { ingredientId: "ing-onion", qty: 0.04, unit: "kg" },
        { ingredientId: "ing-injera", qty: 1, unit: "pcs" },
        { ingredientId: "ing-butter", qty: 0.02, unit: "kg" }
      ]
    },
    {
      id: "prod-4",
      name: "Beyaynetu Fasting Platter",
      category: "Ethiopian Food",
      station: "Kitchen",
      price: 380,
      cost: 110,
      prepTime: 10,
      emoji: "🥗",
      description: "Colorful vegetarian combo platter: Shiro, spicy red lentils, yellow split peas, collard greens & salad.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-injera", qty: 2, unit: "pcs" },
        { ingredientId: "ing-tomato", qty: 0.05, unit: "kg" },
        { ingredientId: "ing-onion", qty: 0.05, unit: "kg" }
      ]
    },
    {
      id: "prod-5",
      name: "Classic Kerevat Pizza",
      category: "Pizza",
      station: "Kitchen",
      price: 560,
      cost: 175,
      prepTime: 16,
      emoji: "🍕",
      description: "Handcrafted thin crust, Italian tomato concassé, fresh mozzarella, beef pepperoni and oregano.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-mozzarella", qty: 0.12, unit: "kg" },
        { ingredientId: "ing-tomato", qty: 0.08, unit: "kg" }
      ]
    },
    {
      id: "prod-6",
      name: "Ethiopian Jebena Bunna",
      category: "Coffee",
      station: "Barista",
      price: 75,
      cost: 15,
      prepTime: 6,
      emoji: "☕",
      description: "Single-origin roasted Harar coffee freshly brewed in clay Jebena pot. Served with roasted popcorn.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-coffee", qty: 0.02, unit: "kg" }
      ]
    },
    {
      id: "prod-7",
      name: "Special Spris Layered Juice",
      category: "Drinks",
      station: "Barista",
      price: 160,
      cost: 45,
      prepTime: 5,
      emoji: "🥤",
      description: "Three layers of thick fresh avocado, sweet mango and papaya topped with lime zest and vimto drizzle.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-avocado", qty: 0.12, unit: "kg" },
        { ingredientId: "ing-mango", qty: 0.12, unit: "kg" }
      ]
    },
    {
      id: "prod-8",
      name: "Addis Double Macchiato",
      category: "Coffee",
      station: "Barista",
      price: 90,
      cost: 22,
      prepTime: 4,
      emoji: "🥛",
      description: "Double espresso pulled over silky steamed fresh whole milk with microfoam art.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-coffee", qty: 0.018, unit: "kg" },
        { ingredientId: "ing-milk", qty: 0.15, unit: "L" }
      ]
    },
    {
      id: "prod-9",
      name: "Tej Honey Wine Cocktail",
      category: "Cocktails",
      station: "Bar",
      price: 220,
      cost: 65,
      prepTime: 4,
      emoji: "🍸",
      description: "Ethiopian fermented organic honey wine, infused gesho leaves, citrus twist and spiced bitters.",
      isAvailable: true,
      recipe: []
    },
    {
      id: "prod-10",
      name: "Chechebsa with Pure Honey",
      category: "Breakfast",
      station: "Kitchen",
      price: 280,
      cost: 75,
      prepTime: 8,
      emoji: "🥞",
      description: "Torn flatbread stir-fried in aromatic Niter Kibbeh spiced butter, berbere, served with wild highland honey.",
      isAvailable: true,
      recipe: [
        { ingredientId: "ing-butter", qty: 0.04, unit: "kg" },
        { ingredientId: "ing-berbere", qty: 0.02, unit: "kg" }
      ]
    },
    {
      id: "prod-11",
      name: "Tiramisu & Mocha Cake",
      category: "Desserts",
      station: "Dessert",
      price: 240,
      cost: 70,
      prepTime: 3,
      emoji: "🍰",
      description: "Savoiardi ladyfingers soaked in Yirgacheffe espresso and mascarpone cream dusted with cocoa.",
      isAvailable: true,
      recipe: []
    }
  ],

  // Live Inventory Stock Records with Low Stock Alerts
  inventory: [
    { id: "ing-beef", name: "Minced Beef (Prime)", category: "Meat & Poultry", stock: 45.0, minThreshold: 15.0, maxThreshold: 80.0, unit: "kg", unitCost: 480 },
    { id: "ing-chicken", name: "Chicken Drumsticks", category: "Meat & Poultry", stock: 30.0, minThreshold: 10.0, maxThreshold: 60.0, unit: "kg", unitCost: 350 },
    { id: "ing-bun", name: "Fresh Burger Buns", category: "Bakery", stock: 85, minThreshold: 30, maxThreshold: 200, unit: "pcs", unitCost: 35 },
    { id: "ing-cheese", name: "Cheddar Cheese Slices", category: "Dairy", stock: 120, minThreshold: 40, maxThreshold: 250, unit: "pcs", unitCost: 20 },
    { id: "ing-mozzarella", name: "Mozzarella Cheese Block", category: "Dairy", stock: 14.0, minThreshold: 5.0, maxThreshold: 30.0, unit: "kg", unitCost: 550 },
    { id: "ing-tomato", name: "Fresh Salad Tomatoes", category: "Produce", stock: 4.5, minThreshold: 15.0, maxThreshold: 50.0, unit: "kg", unitCost: 80 }, // LOW STOCK!
    { id: "ing-onion", name: "Red Onions", category: "Produce", stock: 55.0, minThreshold: 20.0, maxThreshold: 100.0, unit: "kg", unitCost: 60 },
    { id: "ing-fries", name: "French Fries (Frozen)", category: "Frozen", stock: 40.0, minThreshold: 15.0, maxThreshold: 80.0, unit: "kg", unitCost: 130 },
    { id: "ing-berbere", name: "Traditional Berbere Spice", category: "Spices", stock: 18.0, minThreshold: 5.0, maxThreshold: 40.0, unit: "kg", unitCost: 320 },
    { id: "ing-butter", name: "Niter Kibbeh Spiced Butter", category: "Dairy & Spices", stock: 12.0, minThreshold: 4.0, maxThreshold: 25.0, unit: "kg", unitCost: 650 },
    { id: "ing-injera", name: "Fresh Teff Injera", category: "Bakery", stock: 140, minThreshold: 50, maxThreshold: 300, unit: "pcs", unitCost: 25 },
    { id: "ing-coffee", name: "Harar Roasted Coffee Beans", category: "Beverage Raw", stock: 25.0, minThreshold: 8.0, maxThreshold: 50.0, unit: "kg", unitCost: 420 },
    { id: "ing-milk", name: "Fresh Whole Milk (Liters)", category: "Dairy", stock: 8.0, minThreshold: 25.0, maxThreshold: 60.0, unit: "L", unitCost: 85 }, // LOW STOCK!
    { id: "ing-avocado", name: "Fresh Hass Avocado", category: "Produce", stock: 22.0, minThreshold: 8.0, maxThreshold: 40.0, unit: "kg", unitCost: 110 },
    { id: "ing-mango", name: "Fresh Sweet Mango Puree", category: "Produce", stock: 18.0, minThreshold: 6.0, maxThreshold: 35.0, unit: "kg", unitCost: 140 },
    { id: "ing-egg", name: "Fresh Farm Eggs", category: "Dairy & Poultry", stock: 180, minThreshold: 60, maxThreshold: 360, unit: "pcs", unitCost: 18 }
  ],

  // 24 Floor Tables across Zones
  tables: [
    { id: "T1", name: "Table 1", zone: "main", capacity: 4, status: "occupied", orderId: "ORD-1041", waiter: "Ephrem Tefera", guests: 3, orderTotal: 1480, durationMin: 32 },
    { id: "T2", name: "Table 2", zone: "main", capacity: 2, status: "occupied", orderId: "ORD-1042", waiter: "Ephrem Tefera", guests: 2, orderTotal: 960, durationMin: 18 },
    { id: "T3", name: "Table 3", zone: "main", capacity: 4, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "T4", name: "Table 4", zone: "main", capacity: 6, status: "occupied", orderId: "ORD-1043", waiter: "Selamawit B.", guests: 5, orderTotal: 2350, durationMin: 44 },
    { id: "T5", name: "Table 5", zone: "main", capacity: 4, status: "reserved", orderId: null, waiter: "Ephrem Tefera", guests: 4, orderTotal: 0, durationMin: 0, resGuest: "Dr. Tewodros (19:30)" },
    { id: "T6", name: "Table 6", zone: "main", capacity: 2, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "T7", name: "Table 7", zone: "main", capacity: 4, status: "cleaning", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "T8", name: "Table 8", zone: "main", capacity: 8, status: "occupied", orderId: "ORD-1044", waiter: "Kassahun B.", guests: 7, orderTotal: 4100, durationMin: 21 },
    { id: "T9", name: "Table 9", zone: "main", capacity: 4, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "T10", name: "Table 10", zone: "main", capacity: 2, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "T11", name: "Table 11", zone: "main", capacity: 4, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "T12", name: "Table 12", zone: "main", capacity: 6, status: "occupied", orderId: "ORD-1045", waiter: "Ephrem Tefera", guests: 4, orderTotal: 1840, durationMin: 27 },
    
    // VIP Traditional Lounge
    { id: "VIP1", name: "VIP Mesob 1", zone: "vip", capacity: 8, status: "occupied", orderId: "ORD-1046", waiter: "Selamawit B.", guests: 8, orderTotal: 6200, durationMin: 55 },
    { id: "VIP2", name: "VIP Mesob 2", zone: "vip", capacity: 6, status: "reserved", orderId: null, waiter: null, guests: 6, orderTotal: 0, durationMin: 0, resGuest: "Embassy Delegation (20:00)" },
    { id: "VIP3", name: "VIP Mesob 3", zone: "vip", capacity: 8, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "VIP4", name: "VIP Mesob 4", zone: "vip", capacity: 10, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },

    // Terrace
    { id: "TR1", name: "Terrace 1", zone: "terrace", capacity: 4, status: "occupied", orderId: "ORD-1047", waiter: "Ephrem Tefera", guests: 3, orderTotal: 1120, durationMin: 14 },
    { id: "TR2", name: "Terrace 2", zone: "terrace", capacity: 4, status: "occupied", orderId: "ORD-1048", waiter: "Kassahun B.", guests: 2, orderTotal: 840, durationMin: 9 },
    { id: "TR3", name: "Terrace 3", zone: "terrace", capacity: 2, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "TR4", name: "Terrace 4", zone: "terrace", capacity: 4, status: "reserved", orderId: null, waiter: null, guests: 4, orderTotal: 0, durationMin: 0, resGuest: "Almaz & Co." },
    { id: "TR5", name: "Terrace 5", zone: "terrace", capacity: 6, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },

    // Bar Counters
    { id: "BAR1", name: "Bar Seat 1-2", zone: "bar", capacity: 2, status: "occupied", orderId: "ORD-1049", waiter: "Meklit Assefa", guests: 2, orderTotal: 580, durationMin: 15 },
    { id: "BAR2", name: "Bar Seat 3-4", zone: "bar", capacity: 2, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 },
    { id: "BAR3", name: "Bar Seat 5-6", zone: "bar", capacity: 2, status: "available", orderId: null, waiter: null, guests: 0, orderTotal: 0, durationMin: 0 }
  ],

  // Live Orders in System
  orders: [
    {
      id: "ORD-1045",
      orderNumber: 1045,
      type: "Dine-in",
      tableId: "T12",
      tableName: "Table 12",
      waiter: "Ephrem Tefera",
      customer: "Yonas Alemu (VIP)",
      status: "PREPARING", // NEW, PREPARING, READY, SERVED, COMPLETED, CANCELLED
      station: "Kitchen",
      priority: "HIGH",
      timeReceived: "12:21 PM",
      elapsedMinutes: 27, // Delayed alert trigger!
      items: [
        { id: "prod-1", name: "Kerevat Special Burger", qty: 2, price: 480, specialNote: "No onion on one burger", station: "Kitchen" },
        { id: "prod-7", name: "Special Spris Layered Juice", qty: 2, price: 160, specialNote: "Extra cold, fast prep", station: "Barista" },
        { id: "prod-3", name: "Special Beef Tibs", qty: 1, price: 520, specialNote: "Well done, extra spicy berbere", station: "Kitchen" }
      ],
      subtotal: 1800,
      vat: 270,
      serviceCharge: 180,
      total: 2250,
      paymentStatus: "UNPAID",
      paymentMethod: null
    },
    {
      id: "ORD-1046",
      orderNumber: 1046,
      type: "Dine-in",
      tableId: "VIP1",
      tableName: "VIP Mesob 1",
      waiter: "Selamawit B.",
      customer: "Dr. Tewodros (Platinum VIP)",
      status: "PREPARING",
      station: "Kitchen",
      priority: "NORMAL",
      timeReceived: "12:35 PM",
      elapsedMinutes: 13,
      items: [
        { id: "prod-2", name: "Traditional Doro Wat Combo", qty: 4, price: 650, specialNote: "Extra ayib on side", station: "Kitchen" },
        { id: "prod-6", name: "Ethiopian Jebena Bunna", qty: 4, price: 75, specialNote: "Traditional ceremony style", station: "Barista" },
        { id: "prod-9", name: "Tej Honey Wine Cocktail", qty: 4, price: 220, specialNote: "Medium sweet", station: "Bar" }
      ],
      subtotal: 3780,
      vat: 567,
      serviceCharge: 378,
      total: 4725,
      paymentStatus: "UNPAID",
      paymentMethod: null
    },
    {
      id: "ORD-1047",
      orderNumber: 1047,
      type: "Dine-in",
      tableId: "TR1",
      tableName: "Terrace 1",
      waiter: "Ephrem Tefera",
      customer: "Walk-in Guest",
      status: "READY",
      station: "Kitchen",
      priority: "NORMAL",
      timeReceived: "12:38 PM",
      elapsedMinutes: 10,
      items: [
        { id: "prod-1", name: "Kerevat Special Burger", qty: 1, price: 480, specialNote: "Extra cheese", station: "Kitchen" },
        { id: "prod-8", name: "Addis Double Macchiato", qty: 2, price: 90, specialNote: "Low sugar", station: "Barista" }
      ],
      subtotal: 660,
      vat: 99,
      serviceCharge: 66,
      total: 825,
      paymentStatus: "UNPAID",
      paymentMethod: null
    },
    {
      id: "ORD-1048",
      orderNumber: 1048,
      type: "Dine-in",
      tableId: "TR2",
      tableName: "Terrace 2",
      waiter: "Kassahun B.",
      customer: "Selamawit Haile",
      status: "NEW",
      station: "Kitchen",
      priority: "NORMAL",
      timeReceived: "12:44 PM",
      elapsedMinutes: 4,
      items: [
        { id: "prod-4", name: "Beyaynetu Fasting Platter", qty: 2, price: 380, specialNote: "Gluten free injera if possible", station: "Kitchen" },
        { id: "prod-7", name: "Special Spris Layered Juice", qty: 2, price: 160, specialNote: "", station: "Barista" }
      ],
      subtotal: 1080,
      vat: 162,
      serviceCharge: 108,
      total: 1350,
      paymentStatus: "UNPAID",
      paymentMethod: null
    },
    {
      id: "ORD-1049",
      orderNumber: 1049,
      type: "Dine-in",
      tableId: "BAR1",
      tableName: "Bar Seat 1-2",
      waiter: "Meklit Assefa",
      customer: "Walk-in Guest",
      status: "READY",
      station: "Bar",
      priority: "NORMAL",
      timeReceived: "12:36 PM",
      elapsedMinutes: 12,
      items: [
        { id: "prod-9", name: "Tej Honey Wine Cocktail", qty: 2, price: 220, specialNote: "", station: "Bar" }
      ],
      subtotal: 440,
      vat: 66,
      serviceCharge: 44,
      total: 550,
      paymentStatus: "UNPAID",
      paymentMethod: null
    }
  ],

  // Active Staff Roster & Attendance
  staff: [
    { id: "emp-1", name: "Abebe Kebede", role: "Owner", shift: "Flexible", clockIn: "07:15 AM", clockOut: null, status: "Present", pin: "1111", salesToday: 0 },
    { id: "emp-2", name: "Dawit Mengistu", role: "General Manager", shift: "Morning", clockIn: "07:20 AM", clockOut: null, status: "Present", pin: "2222", salesToday: 0 },
    { id: "emp-3", name: "Bethlehem Tadesse", role: "Cashier", shift: "Morning", clockIn: "07:30 AM", clockOut: null, status: "Present", pin: "3333", salesToday: 48750 },
    { id: "emp-4", name: "Ephrem Tefera", role: "Waiter / Server", shift: "Morning", clockIn: "07:45 AM", clockOut: null, status: "Present", pin: "4444", salesToday: 14200 },
    { id: "emp-5", name: "Chef Hailemariam", role: "Executive Chef", shift: "Morning", clockIn: "07:00 AM", clockOut: null, status: "Present", pin: "5555", salesToday: 0 },
    { id: "emp-6", name: "Solomon Getachew", role: "Barista", shift: "Morning", clockIn: "07:30 AM", clockOut: null, status: "Present", pin: "6666", salesToday: 6400 },
    { id: "emp-7", name: "Tadesse Woldie", role: "Storekeeper", shift: "Morning", clockIn: "07:40 AM", clockOut: null, status: "Present", pin: "7777", salesToday: 0 },
    { id: "emp-8", name: "Meklit Assefa", role: "Bartender", shift: "Afternoon", clockIn: "11:30 AM", clockOut: null, status: "Present", pin: "8888", salesToday: 4200 },
    { id: "emp-9", name: "Natnael Desta", role: "Delivery Staff", shift: "Morning", clockIn: "08:15 AM", clockOut: null, status: "Late (15m)", pin: "9999", salesToday: 3100 },
    { id: "emp-10", name: "Meseret Gizaw", role: "Cleaner / Maintenance", shift: "Morning", clockIn: "06:45 AM", clockOut: null, status: "Present", pin: "1234", salesToday: 0 }
  ],

  // Purchasing Requests & Requisitions
  purchasingRequests: [
    { id: "PR-801", requestedBy: "Tadesse Woldie (Storekeeper)", supplier: "Bishoftu Poultry & Farm Ltd.", items: "50kg Chicken Drumsticks, 360 Eggs", amount: 23980, date: "08 Oct 2026", status: "PENDING_MANAGER_APPROVAL" },
    { id: "PR-802", requestedBy: "Chef Hailemariam", supplier: "Mojo Fresh Produce Cooperative", items: "80kg Salad Tomatoes, 60kg Red Onions", amount: 10000, date: "08 Oct 2026", status: "APPROVED" },
    { id: "PR-803", requestedBy: "Solomon Getachew (Barista)", supplier: "Lame Dairy Sh. Co. (Mama Milk)", items: "150L Whole Fresh Milk", amount: 12750, date: "07 Oct 2026", status: "DELIVERED_RECEIVED" }
  ],

  // Suppliers Directory
  suppliers: [
    { id: "sup-1", name: "Bishoftu Poultry & Farm Ltd.", contact: "Ato Girma (+251 911 445566)", supplies: "Chicken, Eggs, Turkey", rating: 4.9, terms: "Net 15 Days", balanceDue: 45000 },
    { id: "sup-2", name: "Mojo Fresh Produce Cooperative", contact: "W/ro Aster (+251 922 112233)", supplies: "Vegetables, Tomatoes, Onions, Herbs", rating: 4.7, terms: "Cash on Delivery", balanceDue: 0 },
    { id: "sup-3", name: "Lame Dairy Sh. Co. (Mama Milk)", contact: "Sales Desk (+251 11 442 8899)", supplies: "Fresh Milk, Butter, Cream, Ayib", rating: 4.8, terms: "Weekly Invoice", balanceDue: 18500 },
    { id: "sup-4", name: "Harar Highlands Coffee Union", contact: "Ato Berhe (+251 933 667788)", supplies: "Single-origin Harar & Yirgacheffe Beans", rating: 5.0, terms: "Net 30 Days", balanceDue: 32000 }
  ],

  // Expenses Records
  expenses: [
    { id: "EXP-301", category: "Food & Beverage Ingredients", description: "Emergency fresh tomato purchase (Local market)", amount: 1800, paidBy: "Cash Float", date: "08 Oct 2026", status: "Approved" },
    { id: "EXP-302", category: "Utilities & Fuel", description: "Diesel for 150kVA standby generator (200 Liters)", amount: 19400, paidBy: "Bank Transfer", date: "07 Oct 2026", status: "Approved" },
    { id: "EXP-303", category: "Maintenance", description: "Espresso machine gasket & pressure valve service", amount: 3500, paidBy: "Petty Cash", date: "06 Oct 2026", status: "Approved" },
    { id: "EXP-304", category: "Salaries & Daily Wages", description: "Kitchen shift overtime allowances", amount: 4800, paidBy: "CBE Birr", date: "06 Oct 2026", status: "Approved" }
  ],

  // Reservations
  reservations: [
    { id: "RES-101", guest: "Dr. Tewodros G.", phone: "+251 933 456789", date: "Today", time: "07:30 PM", guests: 4, tableId: "T5", specialNotes: "Birthday celebration, quiet corner", status: "CONFIRMED" },
    { id: "RES-102", guest: "Embassy Cultural Delegation", phone: "+251 911 998877", date: "Today", time: "08:00 PM", guests: 8, tableId: "VIP2", specialNotes: "Traditional Jebena coffee ceremony requested", status: "CONFIRMED" },
    { id: "RES-103", guest: "Almaz & Co.", phone: "+251 922 443322", date: "Today", time: "08:30 PM", guests: 4, tableId: "TR4", specialNotes: "Outdoor heater please", status: "PENDING" },
    { id: "RES-104", guest: "Eleni Wolde", phone: "+251 944 556677", date: "Tomorrow", time: "01:00 PM", guests: 6, tableId: "T8", specialNotes: "Fasting menu only", status: "CONFIRMED" }
  ],

  // Customer CRM & VIP Loyalty
  customers: [
    { id: "cust-1", name: "Yonas Alemu", phone: "+251 911 234567", tier: "Gold VIP", visits: 34, totalSpend: 54800, points: 548, favDish: "Kerevat Special Burger" },
    { id: "cust-2", name: "Selamawit Haile", phone: "+251 922 789012", tier: "Regular", visits: 12, totalSpend: 16400, points: 164, favDish: "Beyaynetu Platter" },
    { id: "cust-3", name: "Dr. Tewodros G.", phone: "+251 933 456789", tier: "Platinum VIP", visits: 62, totalSpend: 128500, points: 1285, favDish: "Special Beef Tibs" },
    { id: "cust-4", name: "Bethlehem Assefa", phone: "+251 944 112233", tier: "New Guest", visits: 2, totalSpend: 1950, points: 19, favDish: "Addis Macchiato" }
  ],

  // Live Delivery Orders (Lideta & Surrounding Addis Ababa Areas)
  deliveryOrders: [
    { id: "DEL-401", orderNumber: 1050, customer: "Hanna Girma", phone: "+251 911 887766", address: "Lideta, Near Balcha Hospital, House #402", driver: "Natnael Desta", fee: 120, total: 1450, status: "ON_THE_WAY", time: "12:30 PM" },
    { id: "DEL-402", orderNumber: 1051, customer: "Kidus T.", phone: "+251 922 334455", address: "Lideta Commercial Center, 3rd Floor", driver: "Natnael Desta", fee: 100, total: 2100, status: "PREPARING", time: "12:45 PM" }
  ],

  // Complaints & Service Tickets
  complaints: [
    { id: "CMP-01", guest: "Table 12 (Yonas A.)", issue: "Beef Tibs took over 25 minutes to arrive.", status: "INVESTIGATING", assignedTo: "Chef Hailemariam", resolution: "Manager visited table, offered complimentary dessert." }
  ],

  // Smart Automation Rules
  automations: [
    { id: "AUTO-1", trigger: "WHEN Inventory stock falls below Min Threshold", condition: "Stock < Min Threshold", action: "Auto create Purchase Requisition for Storekeeper review", isActive: true },
    { id: "AUTO-2", trigger: "WHEN KDS order preparation exceeds 15 minutes", condition: "Elapsed Prep Time > 15m", action: "Trigger RED alert on Control Center & chime Manager terminal", isActive: true },
    { id: "AUTO-3", trigger: "WHEN Customer accumulates 100 points (100 ETB = 1 pt)", condition: "Points >= 100", action: "Issue 100 ETB complimentary discount voucher", isActive: true },
    { id: "AUTO-4", trigger: "WHEN Cashier closes shift", condition: "Z-Report submitted", action: "Generate official PDF reconciliation & log cash difference to Owner", isActive: true }
  ],

  // System Security & Audit Log Stream
  auditLogs: [
    { time: "12:45:10 PM", user: "Ephrem Tefera (Waiter)", role: "Waiter", action: "ORDER_CREATED", entity: "ORD-1048", details: "Created 2x Beyaynetu, 2x Spris for Table TR2", branch: "Lideta Flagship" },
    { time: "12:38:22 PM", user: "Chef Hailemariam", role: "Chef", action: "KDS_STATUS_READY", entity: "ORD-1047", details: "Marked Order #1047 as READY. Waiter notified.", branch: "Lideta Flagship" },
    { time: "12:25:00 PM", user: "Bethlehem T. (Cashier)", role: "Cashier", action: "DISCOUNT_APPLIED", entity: "ORD-1040", details: "Applied 10% Gold VIP discount (150 ETB). Manager PIN authorized.", branch: "Lideta Flagship" },
    { time: "12:15:30 PM", user: "Tadesse Woldie", role: "Storekeeper", action: "STOCK_DEDUCTED", entity: "RECIPE_BOM", details: "Auto deducted 300g beef, 2 buns for Order #1045", branch: "Lideta Flagship" }
  ]
};

// LocalStorage Helper for Instant Reactive Persistence
class RestaurantStore {
  constructor() {
    const saved = localStorage.getItem("RESTAURANT_OS_STATE_V1");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        // Ensure Lideta branch migration
        if (!this.state.branches || !this.state.branches.some(b => b.id === 'lideta')) {
          this.state.branches = INITIAL_RESTAURANT_DATA.branches;
          if (this.state.meta) {
            this.state.meta.activeBranch = 'lideta';
          }
          this.save();
        }
      } catch (e) {
        console.error("Failed to parse saved state, resetting to initial:", e);
        this.state = INITIAL_RESTAURANT_DATA;
      }
    } else {
      this.state = INITIAL_RESTAURANT_DATA;
      this.save();
    }
  }

  save() {
    localStorage.setItem("RESTAURANT_OS_STATE_V1", JSON.stringify(this.state));
  }

  reset() {
    this.state = INITIAL_RESTAURANT_DATA;
    this.save();
  }
}

window.appStore = new RestaurantStore();
