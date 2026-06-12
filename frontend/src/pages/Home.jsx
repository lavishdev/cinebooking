import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, LogIn, Filter, X, ChevronRight } from 'lucide-react';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation'];
const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'];

const Home = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGenre, setActiveGenre] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAllMovies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByGenre = async (genre) => {
    setLoading(true);
    setError('');
    setActiveGenre(genre);
    setActiveLanguage('');
    setSearchTerm('');
    setActiveFilter('genre');
    try {
      const response = await movieService.getMoviesByGenre(genre);
      setMovies(response.data);
    } catch (err) {
      setError(`No movies found for genre "${genre}".`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByLanguage = async (language) => {
    setLoading(true);
    setError('');
    setActiveLanguage(language);
    setActiveGenre('');
    setSearchTerm('');
    setActiveFilter('language');
    try {
      const response = await movieService.getMoviesByLanguage(language);
      setMovies(response.data);
    } catch (err) {
      setError(`No movies found for language "${language}".`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByTitle = async (title) => {
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    setActiveGenre('');
    setActiveLanguage('');
    setActiveFilter('title');
    try {
      const response = await movieService.getMoviesByTitle(title.trim());
      setMovies(response.data);
    } catch (err) {
      setError(`No movies found matching "${title}".`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setActiveGenre('');
    setActiveLanguage('');
    setSearchTerm('');
    setActiveFilter('all');
    fetchAllMovies();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchByTitle(searchTerm);
  };

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  const chipBase = {
    padding: '0.6rem 1.2rem',
    borderRadius: '50px',
    border: '1px solid var(--border-color)',
    background: 'white',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    boxShadow: 'var(--shadow-sm)',
  };

  const chipActive = {
    ...chipBase,
    background: 'var(--accent-primary)',
    color: '#fff',
    borderColor: 'var(--accent-primary)',
    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
  };

  const sectionLabel = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const getPosterForMovie = (movie) => {
    if (movie.posterUrl) {
      const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080';
      return `${baseUrl}${movie.posterUrl}`;
    }
    const index = (movie.id % 3) + 1;
    return `/poster_${index}.png`;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem', backgroundColor: 'var(--bg-primary)' }}>
      {/* ═══ Clean Minimalist Hero Section ═══ */}
      <div style={{
        position: 'relative',
        padding: user ? '8rem 0 6rem' : '0',
        minHeight: user ? 'auto' : '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, #ffffff 0%, #f0f4f8 100%)',
        marginBottom: user ? '3rem' : '0',
        marginTop: user ? '0' : '-80px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        {/* Soft abstract floating shapes in background */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(0,102,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(0,102,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1000px', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'white', borderRadius: '50px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,102,255,0.1)' }}>
            ✨ The Ultimate Movie Experience
          </div>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            Discover Movies<br/>Like Never Before
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}>
            Browse our curated collection of the latest blockbusters and timeless classics. Book tickets instantly.
          </p>

          {!user ? (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                Create Account <ChevronRight size={18} style={{ marginLeft: '0.2rem' }}/>
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              gap: '0.5rem',
              maxWidth: '600px',
              margin: '0 auto',
              background: 'white',
              padding: '0.5rem',
              borderRadius: '50px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-secondary)' }}>
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search movies by title…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); handleShowAll(); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0 0.5rem' }}
                >
                  <X size={20} />
                </button>
              )}
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 2rem' }}>
                Search
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ═══ Movies Grid ═══ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          {/* ── Minimalist Filter Bar ── */}
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            marginBottom: '4rem',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-md)',
          }}>
            {/* Genre chips */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ ...sectionLabel, marginBottom: '1rem' }}>
                Explore by Genre
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => activeGenre === genre ? handleShowAll() : fetchByGenre(genre)}
                    style={activeGenre === genre ? chipActive : chipBase}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Language chips */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ ...sectionLabel, marginBottom: '1rem' }}>
                Explore by Language
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => activeLanguage === lang ? handleShowAll() : fetchByLanguage(lang)}
                    style={activeLanguage === lang ? chipActive : chipBase}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Show All button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleShowAll}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  borderRadius: '50px',
                  background: '#f8f9fa'
                }}
              >
                <X size={14} />
                Clear Filters
              </button>

              {activeFilter !== 'all' && (
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  background: 'rgba(0,102,255,0.08)',
                  padding: '0.4rem 1rem',
                  borderRadius: '50px',
                  color: 'var(--accent-primary)'
                }}>
                  Showing results for {activeFilter}
                  {activeFilter === 'genre' && `: ${activeGenre}`}
                  {activeFilter === 'language' && `: ${activeLanguage}`}
                  {activeFilter === 'title' && `: "${searchTerm}"`}
                </span>
              )}
            </div>
          </div>

          {/* ── Section heading ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeFilter === 'all' && 'Now Showing'}
              {activeFilter === 'genre' && `${activeGenre} Movies`}
              {activeFilter === 'language' && `${activeLanguage} Movies`}
              {activeFilter === 'title' && `Results for "${searchTerm}"`}
            </h2>
          </div>

          {/* ── Loading / Error / Grid ── */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '6rem 2rem',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(0,102,255,0.1)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1.5rem',
              }} />
              Fetching movies...
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#e74c3c',
              background: '#fdf3f2',
              border: '1px solid #fadbd8',
              borderRadius: '16px',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              <p style={{ marginBottom: '1.5rem', fontWeight: 500 }}>{error}</p>
              <button onClick={handleShowAll} className="btn btn-primary" style={{ fontSize: '0.9rem', borderRadius: '50px' }}>
                Show All Movies
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '6rem 2rem',
              color: 'var(--text-secondary)',
              background: 'white',
              borderRadius: '24px',
              border: '1px dashed rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem', opacity: 0.5 }}>🎬</span>
              <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>No movies found.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4" style={{ gap: '2.5rem 1.5rem' }}>
              {movies.map((movie) => (
                <Link
                  to={user ? `/movie/${movie.id}` : '/login'}
                  key={movie.id}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    {/* Poster Image */}
                    <div style={{
                      height: '380px',
                      backgroundImage: `url(${getPosterForMovie(movie)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}></div>

                    {/* Card body */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 700, 
                        marginBottom: '0.5rem', 
                        color: 'var(--text-primary)',
                        lineHeight: 1.3
                      }}>
                        {movie.name}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.8rem',
                          background: 'rgba(0,102,255,0.08)',
                          color: 'var(--accent-primary)',
                          borderRadius: '50px',
                          fontWeight: 600,
                        }}>
                          {movie.genre}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.8rem',
                          background: '#f8f9fa',
                          color: 'var(--text-secondary)',
                          borderRadius: '50px',
                          fontWeight: 600,
                        }}>
                          {movie.language}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {movie.duration} mins
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          {movie.releaseDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
