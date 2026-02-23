import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ChefHat, MapPin } from 'lucide-react';

const Food = () => {
    const { foodId } = useParams();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In our simple backend, /foods/:id returns food info + the restaurant it belongs to.
        // If a food is served by multiple restaurants, the backend structure usually supports that, 
        // but our current mock data links food to a single restaurantId directly for simplicity.
        // We will display that one restaurant.
        const fetchFood = async () => {
            try {
                const res = await api.get(`/foods/${foodId}`);
                setFood(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFood();
    }, [foodId]);

    if (loading) return <div>Loading...</div>;
    if (!food) return <div>Food not found</div>;

    return (
        <div>
            <Link to="/dashboard" style={{ color: 'var(--text-light)', marginBottom: '20px', display: 'inline-block' }}>&larr; Back to Dashboard</Link>

            <div className="card" style={{ marginBottom: '30px', padding: 0, overflow: 'hidden' }}>
                <img src={food.image} alt={food.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                    <h1>{food.name}</h1>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <span className={`badge ${food.vegNonVeg === 'Veg' ? 'veg' : 'non-veg'}`}>{food.vegNonVeg}</span>
                        <span className="badge">{food.cuisine}</span>
                        <span className="badge">₹{food.price}</span>
                    </div>
                </div>
            </div>

            <h3>Available at Restaurants</h3>
            <div className="grid">
                {/* Simple mock: only one restaurant per food in this data model */}
                <Link to={`/restaurant/${food.restaurant.id}`} className="card" key={food.restaurant.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ChefHat size={18} /> {food.restaurant.name}
                            </h4>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={14} /> {food.restaurant.location}
                            </p>
                        </div>
                        <button className="btn btn-primary">Order Now</button>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Food;
