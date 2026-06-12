import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService, showService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, MapPin, Clock, IndianRupee } from 'lucide-react';

const Booking = () => {
  const { showId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingShow, setFetchingShow] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await showService.getAllShows();
        const found = res.data.find(s => s.id.toString() === showId);
        setShow(found || null);

        if (found) {
          try {
            const seatsRes = await showService.getOccupiedSeats(showId);
            setOccupiedSeats(seatsRes.data || []);
          } catch (e) {
            console.warn("Could not fetch occupied seats. Maybe backend needs restart?", e);
          }
        }
      } catch (err) {
        console.error('Error fetching show:', err);
      } finally {
        setFetchingShow(false);
      }
    };
    fetchShow();
  }, [showId]);

  const ticketPrice = show?.price || 0;
  const totalPrice = selectedSeats.length * ticketPrice;

  const formatShowTime = (showTime) => {
    if (!showTime) return 'N/A';
    return new Date(showTime).toLocaleString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }
    if (!user || !user.id) {
      setError("Session expired or invalid. Please log out and log in again to book tickets.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const bookingData = {
        showId: parseInt(showId),
        userId: user.id,
        numberOfSeats: selectedSeats.length,
        seatNumbers: selectedSeats
      };
      
      await bookingService.createBooking(bookingData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to create booking. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSeatMap = () => {
    if (!show || !show.theatre) return null;
    const capacity = show.theatre.theatreCapacity || 50;
    const seatsPerRow = 10;
    const rows = Math.ceil(capacity / seatsPerRow);
    
    let seatMap = [];
    for (let r = 0; r < rows; r++) {
      let rowSeats = [];
      const rowLetter = String.fromCharCode(65 + r);
      for (let c = 1; c <= seatsPerRow; c++) {
        const seatId = `${rowLetter}${c}`;
        if ((r * seatsPerRow) + c > capacity) break;
        
        const isOccupied = occupiedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        rowSeats.push(
          <button
            key={seatId}
            disabled={isOccupied}
            onClick={() => {
              if (isSelected) {
                setSelectedSeats(selectedSeats.filter(s => s !== seatId));
              } else {
                setSelectedSeats([...selectedSeats, seatId]);
              }
            }}
            style={{
              width: '32px', height: '32px',
              borderRadius: '6px 6px 2px 2px',
              border: 'none',
              cursor: isOccupied ? 'not-allowed' : 'pointer',
              background: isOccupied ? '#555' : isSelected ? 'var(--accent-primary)' : 'white',
              color: isSelected || isOccupied ? 'white' : '#111',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              margin: '0.2rem'
            }}
          >
            {c}
          </button>
        );
      }
      seatMap.push(
        <div key={rowLetter} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ width: '20px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{rowLetter}</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>{rowSeats}</div>
          <span style={{ width: '20px' }}></span>
        </div>
      );
    }
    
    return (
      <div style={{ marginTop: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ minWidth: '400px' }}>
          {/* Screen curve */}
          <div style={{ 
            height: '40px', 
            borderTop: '3px solid var(--accent-primary)',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(229, 9, 20, 0.2), transparent)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            letterSpacing: '0.2em'
          }}>SCREEN</div>
          
          {seatMap}
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#555', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Occupied</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (success) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px' }}>
          <CheckCircle size={64} color="#2ecc71" style={{ margin: '0 auto 1.5rem' }} />
          <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Booking Successful!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your tickets have been reserved. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (fetchingShow) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading show details...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="heading-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>Complete Your Booking</h1>

      {/* Show Info */}
      {show && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 className="heading-md" style={{ marginBottom: '1rem' }}>
            {show.movie?.name || 'Movie'}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={16} /> {formatShowTime(show.showTime)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={16} /> {show.theatre?.theatreName || 'Unknown Theatre'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <IndianRupee size={14} /> {show.price} per ticket
            </span>
          </div>
        </div>
      )}
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(229, 9, 20, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '8px', marginBottom: '1.5rem', color: '#ff4b4b' }}>
            {error}
          </div>
        )}
        
        <h3 className="heading-md" style={{ marginBottom: '1rem', textAlign: 'center' }}>Select Your Seats</h3>
        
        {renderSeatMap()}
        
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tickets × {selectedSeats.length}</span>
            <span>₹ {totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>Selected Seats</span>
            <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>₹ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem' }} 
          onClick={handleBook}
          disabled={loading || selectedSeats.length === 0}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default Booking;
