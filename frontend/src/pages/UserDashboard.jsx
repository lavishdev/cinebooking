import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Ticket, XCircle, Film, MapPin, Calendar } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    } else {
      setError('Could not load bookings. Please log out and log back in.');
      setLoading(false);
    }
  }, [user?.id]);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getUserBookings(user.id);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        fetchBookings();
      } catch (err) {
        console.error('Error canceling booking:', err);
        const msg = err.response?.data?.message || 'Failed to cancel booking.';
        window.alert(msg); // Alert the user why it failed (e.g. past deadline)
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="heading-xl">My Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.username}</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 className="heading-lg" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ticket color="var(--accent-primary)" /> My Bookings
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading bookings...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            You haven't booked any movies yet.
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {bookings.map(booking => (
              <div key={booking.id} style={{
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="heading-md" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Film size={20} /> {booking.show?.movie?.name || `Booking #${booking.id}`}
                  </h3>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: booking.bookingStatus === 'CONFIRMED' ? 'rgba(46, 204, 113, 0.2)' : 
                                booking.bookingStatus === 'CANCELLED' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                    color: booking.bookingStatus === 'CONFIRMED' ? '#2ecc71' : 
                           booking.bookingStatus === 'CANCELLED' ? '#e74c3c' : '#f1c40f'
                  }}>
                    {booking.bookingStatus}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {booking.show?.theatre && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} /> {booking.show.theatre.theatreName} — {booking.show.theatre.theatreLocation}
                    </span>
                  )}
                  {booking.show?.showTime && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} /> {formatDate(booking.show.showTime)}
                    </span>
                  )}
                  <span>Seats: {booking.seatNumbers?.join(', ') || booking.numberOfSeats}</span>
                  <span>Price: ₹{booking.price}</span>
                </div>
                
                {booking.bookingStatus !== 'CANCELLED' && (
                  <button 
                    onClick={() => handleCancel(booking.id)}
                    className="btn" 
                    style={{ color: '#ff4b4b', alignSelf: 'flex-start', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <XCircle size={18} /> Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
