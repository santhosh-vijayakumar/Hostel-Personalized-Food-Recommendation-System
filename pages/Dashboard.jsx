import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Flame, Star, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [hostelTrending, setHostelTrending] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const [foodsRes, recsRes, trendingRes] = await Promise.all([
                    api.get('/foods'),
                    api.post('/recommendations', { userId: user.id }),
                    api.get(`/hostel-trending/${user.hostel || 'Hostel A'}`)
                ]);

                console.log('Foods received:', foodsRes.data);

                if (foodsRes.data && Array.isArray(foodsRes.data)) {
                    setAllFoods(foodsRes.data);
                }

                setRecommendations(recsRes.data.recommendations || []);
                setHostelTrending(trendingRes.data.recommendations || []);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Loading delicious food...</h3>
                <div className="grid" style={{ opacity: 0.5 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card" style={{ height: '150px', background: '#f0f0f0' }}>
                            <div style={{ height: '20px', background: '#ddd', margin: '10px', borderRadius: '4px' }}></div>
                            <div style={{ height: '20px', background: '#ddd', margin: '10px', borderRadius: '4px', width: '60%' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Hello, {user.name} 👋</h2>

            {/* Recommendations Section */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <Star fill="orange" color="orange" /> Recommended for You
                </h3>
                <div className="grid">
                    {recommendations.length > 0 ? (
                        recommendations.map((rec, index) => {
                            const foodDetails = allFoods.find(f => f.name === rec.name);
                            if (!foodDetails) return null;
                            return (
                                <Link to={`/food/${foodDetails.id}`} key={index} className="card" style={{ padding: 0 }}>
                                    <img src={foodDetails.image} alt={foodDetails.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)' }} />
                                    <div style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <h4 style={{ margin: 0 }}>{rec.name}</h4>
                                            <span className={`badge ${foodDetails.vegNonVeg === 'Veg' ? 'veg' : 'non-veg'}`}>
                                                {foodDetails.vegNonVeg}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '5px 0' }}>
                                            {foodDetails.cuisine} • {foodDetails.spiceLevel} Spice
                                        </p>
                                        <div style={{ background: '#f0faff', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', color: '#0984e3', marginTop: '10px' }}>
                                            🤖 {rec.reason}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p>No specific recommendations yet. Try ordering some food!</p>
                    )}
                </div>
            </section>

            {/* Hostel Trending Section */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <Flame fill="#e17055" color="#e17055" /> Popular in {user.hostel || 'Your Hostel'}
                </h3>
                <div className="grid">
                    {hostelTrending.length > 0 ? (
                        hostelTrending.map((rec, index) => {
                            const foodDetails = allFoods.find(f => f.name === rec.name);
                            if (!foodDetails) return null;
                            return (
                                <Link to={`/food/${foodDetails.id}`} key={index} className="card" style={{ padding: 0 }}>
                                    <img src={foodDetails.image} alt={foodDetails.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)' }} />
                                    <div style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <h4 style={{ margin: 0 }}>{rec.name}</h4>
                                            <span className={`badge ${foodDetails.vegNonVeg === 'Veg' ? 'veg' : 'non-veg'}`}>
                                                {foodDetails.vegNonVeg}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '5px 0' }}>
                                            {foodDetails.cuisine}
                                        </p>
                                        <div style={{ background: '#fff0ec', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', color: '#d63031', marginTop: '10px' }}>
                                            🔥 {rec.reason}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p>No trending items in your hostel yet. Be the first to order!</p>
                    )}
                </div>
            </section>

            {/* All Foods Section */}
            <section>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <TrendingUp /> Explore Menu ({allFoods.length} items)
                </h3>
                <div className="grid">
                    {allFoods.length > 0 ? (
                        allFoods.map(food => (
                            <Link to={`/food/${food.id}`} key={food.id} className="card" style={{ padding: 0 }}>
                                <img src={food.image} alt={food.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)' }} />
                                <div style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4>{food.name}</h4>
                                        <span style={{ fontWeight: 'bold', color: '#27ae60' }}>₹{food.price}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>
                                        {food.cuisine}
                                    </p>
                                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                        {food.spiceLevel === 'High' && (
                                            <span className="badge" style={{ background: '#ff5722', color: 'white' }}>
                                                <Flame size={12} /> Spicy
                                            </span>
                                        )}
                                        <span className={`badge ${food.vegNonVeg === 'Veg' ? 'veg' : 'non-veg'}`}>
                                            {food.vegNonVeg}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No foods available. Please check back later.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;