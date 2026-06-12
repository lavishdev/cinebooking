import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService, showService } from '../services/api';
import { Clock, Calendar, MapPin, IndianRupee, Play, Star } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        const movieRes = await movieService.getAllMovies();
        const foundMovie = movieRes.data.find(m => m.id.toString() === id);
        setMovie(foundMovie);
        
        try {
          const showsRes = await showService.getShowsByMovie(id);
          setShows(showsRes.data || []);
        } catch (showError) {
          console.warn('No shows found or error fetching shows:', showError);
          setShows([]);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieAndShows();
  }, [id]);

  const formatShowTime = (showTime) => {
    if (!showTime) return 'N/A';
    const date = new Date(showTime);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPosterForMovie = (movieObj) => {
    if (movieObj?.posterUrl) {
      const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080';
      return `${baseUrl}${movieObj.posterUrl}`;
    }
    const index = ((movieObj?.id || 1) % 3) + 1;
    return `/poster_${index}.png`;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading details...</div>;
  if (!movie) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Movie not found</div>;

  const posterImg = getPosterForMovie(movie);

  return (
    <div className="animate-fade-in" style={{ marginTop: '-80px' }}> {/* Counteract the padding in App.jsx for full bleed */}
      {/* ── MASSIVE CINEMATIC HERO BANNER ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Blurred Background Image */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${posterImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(25px) brightness(0.4)',
          transform: 'scale(1.1)',
          zIndex: -2
        }} />
        
        {/* Gradient Overlay to blend with page bottom */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(10,11,15,0.2) 0%, rgba(10,11,15,0.8) 60%, rgba(10,11,15,1) 100%)',
          zIndex: -1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '4rem', alignItems: 'flex-end', paddingBottom: '3rem' }}>
          
          {/* Main Poster */}
          <div style={{
            width: '320px',
            height: '480px',
            flexShrink: 0,
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 40px rgba(229, 9, 20, 0.3)',
            backgroundImage: `url(${posterImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }} />

          {/* Movie Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}>
              {movie.name}
            </h1>
            
            <div style={{ display: 'flex', gap: '2rem', color: '#e0e0e0', fontSize: '1.1rem', fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} color="var(--accent-primary)" /> {movie.duration} Minutes</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} color="var(--accent-primary)" /> {movie.releaseDate}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={20} color="#f1c40f" fill="#f1c40f" /> 9.4/10</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{ padding: '0.4rem 1.2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}>
                {movie.genre}
              </span>
              <span style={{ padding: '0.4rem 1.2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}>
                {movie.language}
              </span>
            </div>

            <p style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255,255,255,0.8)', 
              lineHeight: 1.6, 
              marginTop: '1rem', 
              maxWidth: '800px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              {movie.description || `Experience the cinematic masterpiece of ${movie.name}. Watch the trailer and book your tickets now to secure the best seats.`}
            </p>

            <div style={{ marginTop: '1rem' }}>
               <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(229, 9, 20, 0.4)' }}>
                  <Play size={20} fill="currentColor" /> Watch Trailer
               </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ── SHOWS SECTION ── */}
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <h2 className="heading-lg" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1rem' }}>
          Available Shows & Theatres
        </h2>
        
        {shows.length === 0 ? (
          <div style={{ padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--text-secondary)' }}>
             <Clock size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
             <p style={{ fontSize: '1.2rem' }}>No shows currently scheduled for this movie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {shows.map(show => (
              <div key={show.id} style={{ 
                padding: '2rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#fff' }}>
                    {formatShowTime(show.showTime)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={18} color="var(--accent-primary)" /> {show.theatre?.theatreName || 'Unknown Theatre'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2ecc71', fontWeight: 600 }}>
                      <IndianRupee size={16} /> {show.price}
                    </span>
                  </div>
                  {show.theatre?.theatreLocation && (
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                      {show.theatre.theatreLocation} • {show.theatre.theatreScreenType}
                    </div>
                  )}
                </div>
                <Link to={`/booking/${show.id}`} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px' }}>
                  Book Tickets
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
