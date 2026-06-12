import React, { useState, useEffect, useCallback } from 'react';
import { movieService, theatreService, showService, bookingService, adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle, Trash2, Edit, MapPin, Clapperboard,
  UserPlus, Ticket, CheckCircle, XCircle, Search, BarChart3, TrendingUp, IndianRupee,
  Users, Armchair, TrendingDown, PieChart, Crown
} from 'lucide-react';

const AdminDashboard = () => {
  const { registerAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('movies');
  const [status, setStatus] = useState({ message: '', type: '' });

  // ── Movies State ──
  const [movieData, setMovieData] = useState({
    name: '', description: '', genre: '', language: '', duration: '', releaseDate: ''
  });
  const [moviePoster, setMoviePoster] = useState(null);
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editMovieData, setEditMovieData] = useState({});
  const [editMoviePoster, setEditMoviePoster] = useState(null);

  // ── Theatres State ──
  const [theatreData, setTheatreData] = useState({
    theatreName: '', theatreLocation: '', theatreCapacity: '', theatreScreenType: ''
  });
  const [theatreSearch, setTheatreSearch] = useState('');
  const [theatres, setTheatres] = useState([]);
  const [editingTheatreId, setEditingTheatreId] = useState(null);
  const [editTheatreData, setEditTheatreData] = useState({});

  // ── Shows State ──
  const [showData, setShowData] = useState({
    showTime: '', price: '', movieId: '', theatreId: ''
  });
  const [shows, setShows] = useState([]);
  const [expandedShowId, setExpandedShowId] = useState(null);
  const [showBookings, setShowBookings] = useState([]);
  const [loadingShowDetails, setLoadingShowDetails] = useState(false);

  // ── Bookings State ──
  const [bookingStatusFilter, setBookingStatusFilter] = useState('PENDING');
  const [bookings, setBookings] = useState([]);

  // ── Admin Registration State ──
  const [adminData, setAdminData] = useState({
    username: '', email: '', password: ''
  });

  // ── Analytics State ──
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // ── Auto-clear status messages ──
  useEffect(() => {
    if (!status.message) return;
    const timer = setTimeout(() => setStatus({ message: '', type: '' }), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  // ── Data loaders ──
  const loadMovies = useCallback(async () => {
    try {
      const res = await movieService.getAllMovies();
      setMovies(res.data);
    } catch (err) {
      console.error('Failed to load movies:', err);
    }
  }, []);

  const loadShows = useCallback(async () => {
    try {
      const res = await showService.getAllShows();
      setShows(res.data);
    } catch (err) {
      console.error('Failed to load shows:', err);
    }
  }, []);

  const loadBookingsByStatus = useCallback(async (s) => {
    try {
      const res = await bookingService.getBookingByStatus(s);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setBookings([]);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const res = await adminService.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      flash('Failed to load analytics data.', 'error');
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
    loadShows();
  }, [loadMovies, loadShows]);

  useEffect(() => {
    if (activeTab === 'bookings') loadBookingsByStatus(bookingStatusFilter);
    if (activeTab === 'analytics') loadAnalytics();
  }, [activeTab, bookingStatusFilter, loadBookingsByStatus, loadAnalytics]);

  // ── Helpers ──
  const flash = (message, type) => setStatus({ message, type });

  const formatShowTime = (t) => {
    if (!t) return 'N/A';
    return new Date(t).toLocaleString('en-IN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // ───────────────────── MOVIE HANDLERS ─────────────────────
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(movieData).forEach(key => formData.append(key, movieData[key]));
      if (moviePoster) formData.append('poster', moviePoster);
      
      await movieService.addMovie(formData);
      flash('Movie added successfully!', 'success');
      setMovieData({ name: '', description: '', genre: '', language: '', duration: '', releaseDate: '' });
      setMoviePoster(null);
      loadMovies();
    } catch (err) {
      flash('Failed to add movie.', 'error');
    }
  };

  const startEditMovie = (movie) => {
    setEditingMovieId(movie.id);
    setEditMovieData({
      name: movie.name || '',
      description: movie.description || '',
      genre: movie.genre || '',
      language: movie.language || '',
      duration: movie.duration || '',
      releaseDate: movie.releaseDate || ''
    });
    setEditMoviePoster(null);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editMovieData).forEach(key => formData.append(key, editMovieData[key]));
      if (editMoviePoster) formData.append('poster', editMoviePoster);
      
      await movieService.updateMovie(editingMovieId, formData);
      flash('Movie updated successfully!', 'success');
      setEditingMovieId(null);
      loadMovies();
    } catch (err) {
      flash('Failed to update movie.', 'error');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await movieService.deleteMovie(id);
      flash('Movie deleted.', 'success');
      loadMovies();
    } catch (err) {
      flash('Failed to delete movie.', 'error');
    }
  };

  // ───────────────────── THEATRE HANDLERS ─────────────────────
  const handleAddTheatre = async (e) => {
    e.preventDefault();
    try {
      await theatreService.addTheatre({
        ...theatreData,
        theatreCapacity: parseInt(theatreData.theatreCapacity)
      });
      flash('Theatre added successfully!', 'success');
      setTheatreData({ theatreName: '', theatreLocation: '', theatreCapacity: '', theatreScreenType: '' });
    } catch (err) {
      flash('Failed to add theatre.', 'error');
    }
  };

  const handleSearchTheatres = async (e) => {
    e.preventDefault();
    if (!theatreSearch.trim()) return;
    try {
      const res = await theatreService.getTheatreByLocation(theatreSearch.trim());
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setTheatres(data.filter(Boolean));
      if (data.filter(Boolean).length === 0) flash('No theatres found for that location.', 'error');
    } catch (err) {
      flash('Failed to search theatres.', 'error');
      setTheatres([]);
    }
  };

  const startEditTheatre = (theatre) => {
    setEditingTheatreId(theatre.id);
    setEditTheatreData({
      theatreName: theatre.theatreName || '',
      theatreLocation: theatre.theatreLocation || '',
      theatreCapacity: theatre.theatreCapacity || '',
      theatreScreenType: theatre.theatreScreenType || ''
    });
  };

  const handleUpdateTheatre = async (e) => {
    e.preventDefault();
    try {
      await theatreService.updateTheatre(editingTheatreId, {
        ...editTheatreData,
        theatreCapacity: parseInt(editTheatreData.theatreCapacity)
      });
      flash('Theatre updated successfully!', 'success');
      setEditingTheatreId(null);
      // Re-search to refresh the list
      if (theatreSearch.trim()) {
        const res = await theatreService.getTheatreByLocation(theatreSearch.trim());
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setTheatres(data.filter(Boolean));
      }
    } catch (err) {
      flash('Failed to update theatre.', 'error');
    }
  };

  const handleDeleteTheatre = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theatre?')) return;
    try {
      await theatreService.deleteTheatre(id);
      flash('Theatre deleted.', 'success');
      setTheatres((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      flash('Failed to delete theatre.', 'error');
    }
  };

  // ───────────────────── SHOW HANDLERS ─────────────────────
  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      await showService.createShow({
        showTime: showData.showTime,
        price: parseFloat(showData.price),
        movieId: parseInt(showData.movieId),
        theatreId: parseInt(showData.theatreId)
      });
      flash('Show created successfully!', 'success');
      setShowData({ showTime: '', price: '', movieId: '', theatreId: '' });
      loadShows();
    } catch (err) {
      flash('Failed to create show.', 'error');
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      await showService.deleteShow(id);
      flash('Show deleted.', 'success');
      if (expandedShowId === id) setExpandedShowId(null);
      loadShows();
    } catch (err) {
      flash('Failed to delete show.', 'error');
    }
  };

  const handleToggleShowDetails = async (id) => {
    if (expandedShowId === id) {
      setExpandedShowId(null);
      return;
    }
    setExpandedShowId(id);
    setLoadingShowDetails(true);
    setShowBookings([]);
    try {
      const res = await bookingService.getShowBookings(id);
      setShowBookings(res.data || []);
    } catch (err) {
      console.error('Failed to load show bookings:', err);
      flash('Failed to load show details.', 'error');
    } finally {
      setLoadingShowDetails(false);
    }
  };

  // ───────────────────── BOOKING HANDLERS ─────────────────────
  const handleConfirmBooking = async (id) => {
    try {
      await bookingService.confirmBooking(id);
      flash('Booking confirmed!', 'success');
      loadBookingsByStatus(bookingStatusFilter);
    } catch (err) {
      flash('Failed to confirm booking.', 'error');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(id);
      flash('Booking cancelled.', 'success');
      loadBookingsByStatus(bookingStatusFilter);
    } catch (err) {
      flash('Failed to cancel booking.', 'error');
    }
  };

  // ───────────────────── ADMIN REG HANDLER ─────────────────────
  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin(adminData);
      flash('Admin user registered successfully!', 'success');
      setAdminData({ username: '', email: '', password: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to register admin.';
      flash(typeof msg === 'string' ? msg : 'Failed to register admin.', 'error');
    }
  };

  // ───────────────────── STYLES ─────────────────────
  const cardStyle = {
    padding: '1.25rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    transition: 'border-color 0.2s ease',
  };

  const cardRowStyle = {
    ...cardStyle,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  };

  const iconBtnStyle = (color) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color,
    padding: '0.4rem',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background 0.2s ease',
  });

  const statusBadge = (s) => {
    const map = {
      PENDING: { bg: 'rgba(241,196,15,0.15)', color: '#f1c40f' },
      CONFIRMED: { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71' },
      CANCELLED: { bg: 'rgba(231,76,60,0.15)', color: '#e74c3c' },
    };
    const c = map[s] || map.PENDING;
    return {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.03em',
      background: c.bg,
      color: c.color,
    };
  };

  const sectionDivider = { borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '2rem' };

  // ── Tab config ──
  const tabs = [
    { key: 'analytics', label: 'Analytics Dashboard', icon: <BarChart3 size={16} /> },
    { key: 'movies', label: 'Manage Movies', icon: <Clapperboard size={16} /> },
    { key: 'theatres', label: 'Manage Theatres', icon: <MapPin size={16} /> },
    { key: 'shows', label: 'Manage Shows', icon: <Ticket size={16} /> },
    { key: 'bookings', label: 'Manage Bookings', icon: <CheckCircle size={16} /> },
    { key: 'admins', label: 'Register Admin', icon: <UserPlus size={16} /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="heading-xl" style={{ marginBottom: '0.5rem' }}>
        Admin Control Panel
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
        Manage movies, theatres, shows, bookings, and admin accounts.
      </p>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab(tab.key); setStatus({ message: '', type: '' }); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Status Message ── */}
      {status.message && (
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: status.type === 'success' ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
          border: `1px solid ${status.type === 'success' ? '#2ecc71' : '#e74c3c'}`,
          borderRadius: '10px',
          marginBottom: '2rem',
          color: status.type === 'success' ? '#2ecc71' : '#e74c3c',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
        }}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {status.message}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem' }}>

        {/* ═══════════════════ TAB 0: ANALYTICS ═══════════════════ */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp color="var(--accent-primary)" size={22} /> Platform Analytics Overview
            </h2>
            
            {loadingAnalytics || !analytics ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading live data...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* ── Top Level Metric Cards ── */}
                <div className="grid grid-cols-4">
                  <div style={{...cardStyle, borderLeft: '4px solid #e50914', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Revenue</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><IndianRupee size={24} color="#e50914" />{analytics.totalRevenue.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{...cardStyle, borderLeft: '4px solid #3498db', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Bookings</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Ticket size={24} color="#3498db" />{analytics.totalBookings}</div>
                  </div>
                  <div style={{...cardStyle, borderLeft: '4px solid #2ecc71', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Registered Users</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={24} color="#2ecc71" />{analytics.totalUsers}</div>
                  </div>
                  <div style={{...cardStyle, borderLeft: '4px solid #e67e22', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Seats Sold</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Armchair size={24} color="#e67e22" />{analytics.totalSeatsSold}</div>
                  </div>
                  <div style={{...cardStyle, borderLeft: '4px solid #9b59b6', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Movies & Shows</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clapperboard size={24} color="#9b59b6" />{analytics.totalMovies} / {analytics.totalShows}</div>
                  </div>
                  <div style={{...cardStyle, borderLeft: '4px solid #f1c40f', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Registered Theatres</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={24} color="#f1c40f" />{analytics.totalTheatres}</div>
                  </div>
                  <div style={{...cardStyle, borderLeft: '4px solid #1abc9c', display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2'}}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Most Popular Theatre</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}><Crown size={22} color="#1abc9c" />{analytics.mostPopularTheatre}</div>
                  </div>
                </div>

                {/* ── Financial Insights ── */}
                <div className="grid grid-cols-2">
                  <div style={{...cardStyle, display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(231, 76, 60, 0.05)'}}>
                    <div style={{ fontSize: '0.85rem', color: '#e74c3c', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Lost / Refunded Revenue</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><TrendingDown size={22} />₹{analytics.lostRevenue.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From CANCELLED bookings</div>
                  </div>
                  <div style={{...cardStyle, display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(52, 152, 219, 0.05)'}}>
                    <div style={{ fontSize: '0.85rem', color: '#3498db', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Avg. Revenue per Booking</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3498db', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>₹{Math.round(analytics.averageRevenuePerBooking).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on CONFIRMED bookings</div>
                  </div>
                </div>

                {/* ── Charts ── */}
                <div className="grid grid-cols-2" style={{ alignItems: 'start' }}>
                  {/* Revenue by Movie */}
                  <div style={{...cardStyle, padding: '2rem'}}>
                    <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BarChart3 size={18} color="var(--accent-primary)" /> Revenue by Movie Breakdown
                    </h3>
                    
                    {Object.keys(analytics.revenueByMovie).length === 0 ? (
                      <div style={{ color: 'var(--text-secondary)' }}>No revenue data generated yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {Object.entries(analytics.revenueByMovie)
                          .sort((a, b) => b[1] - a[1])
                          .map(([movie, revenue], index) => {
                            const maxRev = Math.max(...Object.values(analytics.revenueByMovie));
                            const percent = (revenue / maxRev) * 100;
                            return (
                              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                                  <span>{movie}</span>
                                  <span>₹{revenue.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ 
                                    width: `${percent}%`, 
                                    height: '100%', 
                                    background: `linear-gradient(90deg, #e50914 ${100 - percent}%, #ff4b4b 100%)`,
                                    borderRadius: '4px',
                                    transition: 'width 1s ease-out'
                                  }} />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Booking Status Breakdown */}
                  <div style={{...cardStyle, padding: '2rem'}}>
                    <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <PieChart size={18} color="var(--accent-primary)" /> Booking Status Breakdown
                    </h3>
                    {Object.keys(analytics.bookingStatusBreakdown).length === 0 ? (
                      <div style={{ color: 'var(--text-secondary)' }}>No bookings yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {Object.entries(analytics.bookingStatusBreakdown).map(([status, count]) => {
                          const total = Object.values(analytics.bookingStatusBreakdown).reduce((a, b) => a + b, 0);
                          const percent = (count / total) * 100;
                          
                          let color = '#f1c40f'; // PENDING
                          if (status === 'CONFIRMED') color = '#2ecc71';
                          if (status === 'CANCELLED') color = '#e74c3c';

                          return (
                            <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                                  {status}
                                </span>
                                <span>{count} ({percent.toFixed(1)}%)</span>
                              </div>
                              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ 
                                  width: `${percent}%`, 
                                  height: '100%', 
                                  background: color,
                                  borderRadius: '4px',
                                  transition: 'width 1s ease-out'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB 1: MOVIES ═══════════════════ */}
        {activeTab === 'movies' && (
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle color="var(--accent-primary)" size={22} /> Add New Movie
            </h2>
            <form onSubmit={handleAddMovie} className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Name</label>
                <input type="text" className="input-field" value={movieData.name}
                  onChange={(e) => setMovieData({ ...movieData, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <input type="text" className="input-field" value={movieData.description}
                  onChange={(e) => setMovieData({ ...movieData, description: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Genre</label>
                <input type="text" className="input-field" value={movieData.genre}
                  onChange={(e) => setMovieData({ ...movieData, genre: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Language</label>
                <input type="text" className="input-field" value={movieData.language}
                  onChange={(e) => setMovieData({ ...movieData, language: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Duration (mins)</label>
                <input type="number" className="input-field" value={movieData.duration}
                  onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Release Date</label>
                <input type="date" className="input-field" value={movieData.releaseDate}
                  onChange={(e) => setMovieData({ ...movieData, releaseDate: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Movie Poster Image</label>
                <input type="file" className="input-field" accept="image/*"
                  onChange={(e) => setMoviePoster(e.target.files[0])} style={{ padding: '0.4rem' }} />
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PlusCircle size={16} /> Save Movie
                </button>
              </div>
            </form>

            {/* Existing Movies List */}
            {movies.length > 0 && (
              <div style={sectionDivider}>
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>
                  Existing Movies ({movies.length})
                </h3>
                <div className="grid grid-cols-2">
                  {movies.map((m) =>
                    editingMovieId === m.id ? (
                      /* ── Inline Edit Form ── */
                      <form key={m.id} onSubmit={handleUpdateMovie} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Name</label>
                          <input type="text" className="input-field" value={editMovieData.name}
                            onChange={(e) => setEditMovieData({ ...editMovieData, name: e.target.value })} required />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Description</label>
                          <input type="text" className="input-field" value={editMovieData.description}
                            onChange={(e) => setEditMovieData({ ...editMovieData, description: e.target.value })} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Genre</label>
                            <input type="text" className="input-field" value={editMovieData.genre}
                              onChange={(e) => setEditMovieData({ ...editMovieData, genre: e.target.value })} required />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Language</label>
                            <input type="text" className="input-field" value={editMovieData.language}
                              onChange={(e) => setEditMovieData({ ...editMovieData, language: e.target.value })} required />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Duration</label>
                            <input type="number" className="input-field" value={editMovieData.duration}
                              onChange={(e) => setEditMovieData({ ...editMovieData, duration: e.target.value })} required />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Release Date</label>
                            <input type="date" className="input-field" value={editMovieData.releaseDate}
                              onChange={(e) => setEditMovieData({ ...editMovieData, releaseDate: e.target.value })} required />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Update Poster</label>
                            <input type="file" className="input-field" accept="image/*"
                              onChange={(e) => setEditMoviePoster(e.target.files[0])} style={{ padding: '0.4rem' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                            <CheckCircle size={14} style={{ marginRight: '0.3rem' }} /> Save
                          </button>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}
                            onClick={() => setEditingMovieId(null)}>
                            <XCircle size={14} style={{ marginRight: '0.3rem' }} /> Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* ── Display Card ── */
                      <div key={m.id} style={cardRowStyle}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{m.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {m.genre} • {m.language} • {m.duration}m
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                          <button onClick={() => startEditMovie(m)} style={iconBtnStyle('#3498db')} title="Edit">
                            <Edit size={17} />
                          </button>
                          <button onClick={() => handleDeleteMovie(m.id)} style={iconBtnStyle('#e74c3c')} title="Delete">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB 2: THEATRES ═══════════════════ */}
        {activeTab === 'theatres' && (
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle color="var(--accent-primary)" size={22} /> Add New Theatre
            </h2>
            <form onSubmit={handleAddTheatre} className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Theatre Name</label>
                <input type="text" className="input-field" value={theatreData.theatreName}
                  onChange={(e) => setTheatreData({ ...theatreData, theatreName: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Location</label>
                <input type="text" className="input-field" value={theatreData.theatreLocation}
                  onChange={(e) => setTheatreData({ ...theatreData, theatreLocation: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Capacity</label>
                <input type="number" className="input-field" value={theatreData.theatreCapacity}
                  onChange={(e) => setTheatreData({ ...theatreData, theatreCapacity: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Screen Type</label>
                <input type="text" className="input-field" placeholder="e.g. IMAX, 4DX, Standard"
                  value={theatreData.theatreScreenType}
                  onChange={(e) => setTheatreData({ ...theatreData, theatreScreenType: e.target.value })} required />
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PlusCircle size={16} /> Save Theatre
                </button>
              </div>
            </form>

            {/* Search Theatres */}
            <div style={sectionDivider}>
              <h3 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={18} color="var(--accent-primary)" /> Search Theatres by Location
              </h3>
              <form onSubmit={handleSearchTheatres} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">Location</label>
                  <input type="text" className="input-field" placeholder="Enter location to search..."
                    value={theatreSearch} onChange={(e) => setTheatreSearch(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', height: 'fit-content' }}>
                  <Search size={16} /> Search
                </button>
              </form>

              {/* Theatre Search Results */}
              {theatres.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 className="heading-md" style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                    Results ({theatres.length})
                  </h4>
                  <div className="grid grid-cols-2">
                    {theatres.map((t) =>
                      editingTheatreId === t.id ? (
                        /* ── Inline Edit Form ── */
                        <form key={t.id} onSubmit={handleUpdateTheatre} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Theatre Name</label>
                            <input type="text" className="input-field" value={editTheatreData.theatreName}
                              onChange={(e) => setEditTheatreData({ ...editTheatreData, theatreName: e.target.value })} required />
                          </div>
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Location</label>
                            <input type="text" className="input-field" value={editTheatreData.theatreLocation}
                              onChange={(e) => setEditTheatreData({ ...editTheatreData, theatreLocation: e.target.value })} required />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label className="input-label">Capacity</label>
                              <input type="number" className="input-field" value={editTheatreData.theatreCapacity}
                                onChange={(e) => setEditTheatreData({ ...editTheatreData, theatreCapacity: e.target.value })} required />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label className="input-label">Screen Type</label>
                              <input type="text" className="input-field" value={editTheatreData.theatreScreenType}
                                onChange={(e) => setEditTheatreData({ ...editTheatreData, theatreScreenType: e.target.value })} required />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                              <CheckCircle size={14} style={{ marginRight: '0.3rem' }} /> Save
                            </button>
                            <button type="button" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}
                              onClick={() => setEditingTheatreId(null)}>
                              <XCircle size={14} style={{ marginRight: '0.3rem' }} /> Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* ── Display Card ── */
                        <div key={t.id} style={cardRowStyle}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {t.theatreName} 
                              <span style={{fontSize: '0.8rem', color: 'var(--accent-primary)', marginLeft: '0.5rem'}}>
                                (Theatre ID: {t.id})
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={12} /> {t.theatreLocation} • {t.theatreCapacity} seats • {t.theatreScreenType}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                            <button onClick={() => startEditTheatre(t)} style={iconBtnStyle('#3498db')} title="Edit">
                              <Edit size={17} />
                            </button>
                            <button onClick={() => handleDeleteTheatre(t.id)} style={iconBtnStyle('#e74c3c')} title="Delete">
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 3: SHOWS ═══════════════════ */}
        {activeTab === 'shows' && (
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clapperboard color="var(--accent-primary)" size={22} /> Create New Show
            </h2>
            <form onSubmit={handleCreateShow} className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Movie</label>
                <select className="input-field" value={showData.movieId}
                  onChange={(e) => setShowData({ ...showData, movieId: e.target.value })} required>
                  <option value="">Select a movie</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Theatre ID</label>
                <input type="number" className="input-field" placeholder="Enter theatre ID"
                  value={showData.theatreId}
                  onChange={(e) => setShowData({ ...showData, theatreId: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Show Time</label>
                <input type="datetime-local" className="input-field" value={showData.showTime}
                  onChange={(e) => setShowData({ ...showData, showTime: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Price (₹)</label>
                <input type="number" step="0.01" className="input-field" value={showData.price}
                  onChange={(e) => setShowData({ ...showData, price: e.target.value })} required />
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PlusCircle size={16} /> Create Show
                </button>
              </div>
            </form>

            {/* Existing Shows List */}
            {shows.length > 0 && (
              <div style={sectionDivider}>
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>
                  Existing Shows ({shows.length})
                </h3>
                <div className="grid grid-cols-2">
                  {shows.map((s) => (
                    <div key={s.id} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                      <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s ease' }} onClick={() => handleToggleShowDetails(s.id)} className="hover-bg-light">
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {s.movie?.name || 'Unknown Movie'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {s.theatre?.theatreName || 'Unknown Theatre'} • {formatShowTime(s.showTime)} • ₹{s.price}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteShow(s.id); }} style={iconBtnStyle('#e74c3c')} title="Delete">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded Details Section */}
                      {expandedShowId === s.id && (
                        <div style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem', background: 'rgba(0,0,0,0.2)' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Show Bookings</h4>
                          {loadingShowDetails ? (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading details...</div>
                          ) : showBookings.length === 0 ? (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No bookings for this show yet.</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {showBookings.map(b => (
                                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px' }}>
                                  <span>👤 {b.user?.username || 'Unknown'} <span style={statusBadge(b.bookingStatus)} style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{b.bookingStatus}</span></span>
                                  <span style={{ color: 'var(--text-secondary)' }}>{b.numberOfSeats} seats ({Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : b.seatNumbers || 'N/A'})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB 4: BOOKINGS ═══════════════════ */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ticket color="var(--accent-primary)" size={22} /> Manage Bookings
            </h2>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {['PENDING', 'CONFIRMED', 'CANCELLED'].map((s) => (
                <button
                  key={s}
                  className={`btn ${bookingStatusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setBookingStatusFilter(s)}
                  style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {s === 'PENDING' && <Ticket size={14} />}
                  {s === 'CONFIRMED' && <CheckCircle size={14} />}
                  {s === 'CANCELLED' && <XCircle size={14} />}
                  {s}
                </button>
              ))}
            </div>

            {/* Booking Results */}
            {bookings.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No {bookingStatusFilter.toLowerCase()} bookings found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bookings.map((b) => (
                  <div key={b.id} style={{
                    ...cardStyle,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                          {b.show?.movie?.name || 'Unknown Movie'}
                        </span>
                        <span style={statusBadge(b.bookingStatus)}>{b.bookingStatus}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem' }}>
                        <span>👤 {b.user?.username || 'N/A'}</span>
                        <span>💺 {b.numberOfSeats} seat{b.numberOfSeats !== 1 ? 's' : ''}</span>
                        <span>🎫 {Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : b.seatNumbers || 'N/A'}</span>
                        <span>₹{b.price}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {b.bookingStatus === 'PENDING' && (
                        <>
                          <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            onClick={() => handleConfirmBooking(b.id)}>
                            <CheckCircle size={14} /> Confirm
                          </button>
                          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#e74c3c' }}
                            onClick={() => handleCancelBooking(b.id)}>
                            <XCircle size={14} /> Cancel
                          </button>
                        </>
                      )}
                      {b.bookingStatus === 'CONFIRMED' && (
                        <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#e74c3c' }}
                          onClick={() => handleCancelBooking(b.id)}>
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB 5: ADMIN REGISTRATION ═══════════════════ */}
        {activeTab === 'admins' && (
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus color="var(--accent-primary)" size={22} /> Register New Admin
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Create a new user with administrator privileges. Only existing admins can perform this action.
            </p>
            <form onSubmit={handleRegisterAdmin} className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Username</label>
                <input type="text" className="input-field" value={adminData.username}
                  onChange={(e) => setAdminData({ ...adminData, username: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" className="input-field" value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input type="password" className="input-field" value={adminData.password}
                  onChange={(e) => setAdminData({ ...adminData, password: e.target.value })} required />
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={16} /> Register Admin
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
