const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;
const ML_SERVICE_URL = 'http://127.0.0.1:5001';

app.use(cors());
app.use(bodyParser.json());

// --- In-Memory Data Store ---
const users = [];
const foods = [
  { id: 'f1', name: 'Veg Biryani', image: 'https://placehold.co/400x300?text=Veg+Biryani', cuisine: 'North Indian', vegNonVeg: 'Veg', spiceLevel: 'Medium', price: 120, restaurantId: 'r1' },
  { id: 'f2', name: 'Chicken Biryani', image: 'https://placehold.co/400x300?text=Chicken+Biryani', cuisine: 'North Indian', vegNonVeg: 'Non-veg', spiceLevel: 'High', price: 150, restaurantId: 'r1' },
  { id: 'f3', name: 'Masala Dosa', image: 'https://placehold.co/400x300?text=Masala+Dosa', cuisine: 'South Indian', vegNonVeg: 'Veg', spiceLevel: 'Low', price: 60, restaurantId: 'r2' },
  { id: 'f4', name: 'Paneer Butter Masala', image: 'https://placehold.co/400x300?text=Paneer+Butter+Masala', cuisine: 'North Indian', vegNonVeg: 'Veg', spiceLevel: 'Medium', price: 140, restaurantId: 'r1' },
  { id: 'f5', name: 'Chicken Fried Rice', image: 'https://placehold.co/400x300?text=Chicken+Fried+Rice', cuisine: 'Chinese', vegNonVeg: 'Non-veg', spiceLevel: 'Medium', price: 130, restaurantId: 'r3' },
  { id: 'f6', name: 'Veg Noodles', image: 'https://placehold.co/400x300?text=Veg+Noodles', cuisine: 'Chinese', vegNonVeg: 'Veg', spiceLevel: 'Low', price: 100, restaurantId: 'r3' },
  { id: 'f7', name: 'Idli Vada', image: 'https://placehold.co/400x300?text=Idli+Vada', cuisine: 'South Indian', vegNonVeg: 'Veg', spiceLevel: 'Low', price: 50, restaurantId: 'r2' },
  { id: 'f8', name: 'Aloo Paratha', image: 'https://placehold.co/400x300?text=Aloo+Paratha', cuisine: 'North Indian', vegNonVeg: 'Veg', spiceLevel: 'Medium', price: 80, restaurantId: 'r1' },
];

const restaurants = [
  { id: 'r1', name: 'Campus Spice', location: 'Main Block' },
  { id: 'r2', name: 'Southern Delights', location: 'Hostel Block A' },
  { id: 'r3', name: 'Dragon Bowl', location: 'Near Gate 2' },
];

const hostelBlocks = [
  { name: 'Hostel A', floors: 4 },
  { name: 'Hostel B', floors: 4 },
  { name: 'Girls Hostel', floors: 3 },
];

const orders = [];

// --- Routes ---

// Login
app.post('/api/login', (req, res) => {
  const { studentId, password } = req.body;
  // Dummy logic: Check if user exists
  const user = users.find(u => u.studentId === studentId && u.password === password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
  }
});

// Signup
app.post('/api/signup', (req, res) => {
  const userData = req.body;
  // Simple validation
  if (!userData.studentId || !userData.name || !userData.hostel || !userData.roomNumber) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const existingUser = users.find(u => u.studentId === userData.studentId);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const newUser = { ...userData, id: `u${users.length + 1}` };
  users.push(newUser);
  console.log('User registered:', newUser.name);
  res.json({ success: true, user: newUser });
});

// Get Foods
app.get('/api/foods', (req, res) => {
  res.json(foods);
});

// Get Restaurants
app.get('/api/restaurants', (req, res) => {
  res.json(restaurants);
});

// Get Single Restaurant & Menu
app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  const menu = foods.filter(f => f.restaurantId === req.params.id);
  res.json({ ...restaurant, menu });
});

// Get Single Food
app.get('/api/foods/:id', (req, res) => {
  const food = foods.find(f => f.id === req.params.id);
  if (!food) return res.status(404).json({ message: 'Food not found' });

  const restaurant = restaurants.find(r => r.id === food.restaurantId);
  res.json({ ...food, restaurant });
});


// Place Order
app.post('/api/orders', (req, res) => {
  const orderData = req.body; // { userId, items: [{ foodId, quantity }], hostel, floor, timeSlot }
  if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  const user = users.find(u => u.id === orderData.userId);
  const hostelBlock = user ? user.hostel : (orderData.hostel || 'Unknown');
  const floor = user ? user.floor : (orderData.floor || 'Unknown');
  const roomNumber = user ? user.roomNumber : (orderData.roomNumber || 'Unknown');

  const newOrder = {
    id: `o${orders.length + 1}`,
    ...orderData,
    hostelBlock, // Store for trending logic
    floor,
    roomNumber,
    status: 'Confirmed',
    timestamp: new Date()
  };
  orders.push(newOrder);
  console.log('Order placed:', newOrder.id);
  res.json({ success: true, order: newOrder });
});

// Get User Orders
app.get('/api/orders/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json(userOrders);
});

// Get Hostel Trending
app.get('/api/hostel-trending/:hostelBlock', (req, res) => {
  const { hostelBlock } = req.params;

  // Filter orders by hostel block
  const hostelOrders = orders.filter(o => o.hostelBlock === hostelBlock);

  // Aggregate items
  const itemCounts = {};
  hostelOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        // item can be { foodId, quantity } or just foodId depending on frontend impl
        // Assuming { name, quantity } or matching by ID. 
        // Let's rely on foodId if available, else name.
        // Frontend sends: items: [{ id: '...', name: '...', quantity: 1 }] typically.
        // Let's assume we count by 'name' for simplicity as per existing "Popular" logic
        const key = item.name || item.id;
        if (!itemCounts[key]) itemCounts[key] = 0;
        itemCounts[key] += (item.quantity || 1);
      });
    }
  });

  // Convert to array and sort
  const sortedItems = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  // Map to format expected by UI (name + reason)
  const trending = sortedItems.map(item => ({
    name: item.name,
    reason: `Popular in ${hostelBlock} (${item.count} orders)`
  }));

  res.json({ recommendations: trending });
});

// Get Recommendations (Proxy to ML Service)
app.post('/api/recommendations', async (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);

  if (!user) {
    // If no user/guest, return popular items as fallback
    return res.json({
      recommendations: foods.slice(0, 3).map(f => f.name),
      reason: "Popular items for everyone"
    });
  }

  // Construct preferences object since user is flat
  const userPreferences = {
    cuisines: user.cuisines || [],
    spiceLevel: user.spiceLevel || 'Medium',
    vegNonVeg: user.vegNonVeg || 'Both',
    favouriteFoods: user.favouriteFoods || []
  };

  try {
    // Call Python ML Service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/recommend`, {
      user_preferences: userPreferences,
      recent_orders: orders.filter(o => o.userId === userId).slice(-5), // Send last 5 orders
      available_foods: foods
    });

    // ML Service returns list of food names/ids. match back to full food objects if needed, 
    // but the UI might just need names + reason.
    // Let's assume ML returns { recommendations: [{ name: '...', reason: '...' }] }
    res.json(mlResponse.data);

  } catch (error) {
    console.error('ML Service Error:', error.message);
    // Fallback if ML service is down
    const fallbackRecs = foods
      .filter(f => userPreferences.cuisines.includes(f.cuisine) || userPreferences.vegNonVeg === f.vegNonVeg)
      .slice(0, 3)
      .map(f => ({ name: f.name, reason: "Based on your preferences (Fallback)" }));

    res.json({ recommendations: fallbackRecs });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
