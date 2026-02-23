import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Clock } from 'lucide-react';

const Restaurant = () => {
    const { restaurantId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [cart, setCart] = useState({}); // { foodId: quantity }
    const [loading, setLoading] = useState(true);

    // Order Details
    const [timeSlot, setTimeSlot] = useState('19:00-19:30');
    const [floor, setFloor] = useState(user?.floor || '1');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await api.get(`/restaurants/${restaurantId}`);
                setRestaurant(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [restaurantId]);

    const updateCart = (foodId, delta) => {
        setCart(prev => {
            const current = prev[foodId] || 0;
            const updated = current + delta;
            if (updated <= 0) {
                const { [foodId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [foodId]: updated };
        });
    };

    const handlePlaceOrder = async () => {
        const orderItems = Object.entries(cart).map(([foodId, quantity]) => ({ foodId, quantity }));
        if (orderItems.length === 0) return;

        try {
            await api.post('/orders', {
                userId: user.id,
                restaurantId,
                items: orderItems,
                hostel: user.hostel,
                floor,
                timeSlot
            });
            navigate('/order-confirmation');
        } catch (error) {
            alert('Failed to place order');
        }
    };

    const totalPrice = restaurant ? Object.entries(cart).reduce((total, [foodId, qty]) => {
        const food = restaurant.menu.find(f => f.id === foodId);
        return total + (food ? food.price * qty : 0);
    }, 0) : 0;

    if (loading) return <div>Loading...</div>;
    if (!restaurant) return <div>Restaurant not found</div>;

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1>{restaurant.name}</h1>
                <p style={{ color: 'var(--text-light)' }}>{restaurant.location}</p>
            </div>

            <h3>Menu</h3>
            <div className="grid">
                {restaurant.menu.map(food => (
                    <div key={food.id} className="card" style={{ display: 'flex', gap: '15px' }}>
                        <img src={food.image} alt={food.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4>{food.name}</h4>
                                <span className={`badge ${food.vegNonVeg === 'Veg' ? 'veg' : 'non-veg'}`}>{food.vegNonVeg}</span>
                            </div>
                            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>₹{food.price}</p>

                            {cart[food.id] ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={() => updateCart(food.id, -1)} className="btn btn-outline" style={{ padding: '5px 10px' }}>-</button>
                                    <span>{cart[food.id]}</span>
                                    <button onClick={() => updateCart(food.id, 1)} className="btn btn-outline" style={{ padding: '5px 10px' }}>+</button>
                                </div>
                            ) : (
                                <button onClick={() => updateCart(food.id, 1)} className="btn btn-outline" style={{ width: '100%', marginTop: '10px' }}>Add</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {
                Object.keys(cart).length > 0 && (
                    <div style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        background: 'white', borderTop: '1px solid var(--border)',
                        padding: '15px 20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div>
                                <strong>Total: ₹{totalPrice}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{Object.values(cart).reduce((a, b) => a + b, 0)} Items</div>
                            </div>

                            {/* Delivery Details Inputs */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} style={{ marginBottom: 0, width: 'auto' }}>
                                    <option>19:00-19:30</option>
                                    <option>19:30-20:00</option>
                                    <option>20:00-20:30</option>
                                </select>
                                <select value={floor} onChange={e => setFloor(e.target.value)} style={{ marginBottom: 0, width: 'auto' }}>
                                    <option value="1">Floor 1</option>
                                    <option value="2">Floor 2</option>
                                    <option value="3">Floor 3</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={handlePlaceOrder} className="btn btn-primary">Place Bulk Order</button>
                    </div>
                )
            }
        </div>
    );
};

export default Restaurant;
