import React, { useEffect, useState } from 'react';
import './SmartDustbinPage.css';
import { Trash, Plus, X } from 'lucide-react';
import axios from 'axios';

const SmartDustbinPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [newDustbin, setNewDustbin] = useState({ location: '', bValue: '', nbValue: '' });

    // Fetch dustbin data from backend
    const fetchDustbinData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5050/api/dustbins');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching dustbin data:', error);
        }
    };

    useEffect(() => {
        fetchDustbinData();
        const interval = setInterval(fetchDustbinData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Handle adding a new dustbin
    const handleAddDustbin = async () => {
        try {
            await axios.post('http://127.0.0.1:5050/api/add-dustbin', newDustbin);
            alert(`Dustbin added successfully!`);
            setNewDustbin({ location: '', bValue: '', nbValue: '' });
            fetchDustbinData();
        } catch (error) {
            console.error('Error adding dustbin:', error);
            alert('Failed to add dustbin.');
        }
    };

    // Handle deleting a dustbin
    const handleDeleteDustbin = async (location) => {
        try {
            await axios.delete('http://127.0.0.1:5050/api/delete-dustbin', {
                data: { location },
            });
            alert('Dustbin deleted successfully!');
            fetchDustbinData();
        } catch (error) {
            console.error('Error deleting dustbin:', error);
            alert('Failed to delete dustbin.');
        }
    };

    return (
        <div className="smart-dustbin-page">
            <h1>Smart Dustbin Notifications</h1>

            <div className="add-dustbin-section">
                <h2>Add New Dustbin</h2>
                <input
                    type="text"
                    placeholder="Location"
                    value={newDustbin.location}
                    onChange={(e) => setNewDustbin({ ...newDustbin, location: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="B Value"
                    value={newDustbin.bValue}
                    onChange={(e) => setNewDustbin({ ...newDustbin, bValue: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="NB Value"
                    value={newDustbin.nbValue}
                    onChange={(e) => setNewDustbin({ ...newDustbin, nbValue: e.target.value })}
                />
                <button onClick={handleAddDustbin} className="add-dustbin-button">
                    <Plus size={20} /> Add Dustbin
                </button>
            </div>

            <div className="notification-grid">
                {notifications.map((notification) => (
                    <div key={notification._id} className="notification-bar">
                        <div className="notification-icon">
                            <Trash size={24} />
                        </div>
                        <div className="notification-content">
                            <div className="notification-heading">{notification.location}</div>
                            <div className="notification-values">
                                <div className="value-item">
                                    <span className="value-label">B:</span> {notification.bValue}
                                </div>
                                <div className="value-item">
                                    <span className="value-label">NB:</span> {notification.nbValue}
                                </div>
                            </div>
                            <div className="notification-buttons">
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteDustbin(notification.location)}
                                >
                                    <X size={20} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartDustbinPage;
