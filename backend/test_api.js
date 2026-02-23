const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('--- Starting API Verification ---');

    try {
        // 1. Test GET /foods
        console.log('\nTesting GET /foods...');
        const foodsRes = await axios.get(`${BASE_URL}/foods`);
        if (foodsRes.status === 200 && Array.isArray(foodsRes.data)) {
            console.log('SUCCESS: Retrieved foods list.');
            console.log(`Found ${foodsRes.data.length} items.`);
        } else {
            console.error('FAILURE: Unexpected response from /foods');
        }

        // 2. Test Recommendation Flow
        // First need a user to get recommendations for.
        // Create a dummy user first (Signup)
        console.log('\nTesting Signup Flow...');
        const userPayload = {
            studentId: 'TEST1234',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password',
            hostel: 'Hostel A',
            floor: '1',
            cuisines: ['North Indian'],
            spiceLevel: 'High',
            vegNonVeg: 'Non-veg',
            favouriteFoods: 'Biryani'
        };

        let userId;
        try {
            const signupRes = await axios.post(`${BASE_URL}/signup`, userPayload);
            if (signupRes.data.success) {
                userId = signupRes.data.user.id;
                console.log(`SUCCESS: User signed up with ID: ${userId}`);
            }
        } catch (e) {
            if (e.response && e.response.status === 400 && e.response.data.message === 'User already exists') {
                console.log('User already exists, proceeding...');
                // Hack: find ID if exists (not exposed in API, but for test we assume predictable ID or skip)
                // Actually, login to get ID
                const loginRes = await axios.post(`${BASE_URL}/login`, { studentId: 'TEST1234', password: 'password' });
                userId = loginRes.data.user.id;
            } else {
                throw e;
            }
        }

        // Now get recommendations
        console.log(`\nTesting Recommendations for User ${userId}...`);
        const recRes = await axios.post(`${BASE_URL}/recommendations`, { userId });

        if (recRes.status === 200) {
            console.log('SUCCESS: Recommendations received.');
            console.log('Recommendations:', recRes.data.recommendations);
        } else {
            console.error('FAILURE: Recommendations failed.');
        }

    } catch (error) {
        console.error('TEST FAILED:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

runTests();
