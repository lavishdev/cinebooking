import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerNormalUser: (userData) => api.post('/auth/registernormaluser', userData),
  registerAdmin: (userData) => api.post('/admin/register', userData),
  verifyLoginOtp: (data) => api.post('/auth/verify-login-otp', data),
  verifyRegisterOtp: (data) => api.post('/auth/verify-register-otp', data),
};

// Admin Service
export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
};
// Movie Service
export const movieService = {
  getAllMovies: () => api.get('/movies/getallmovies'),
  getMoviesByGenre: (genre) => api.get(`/movies/getmoviesbygenre?genre=${genre}`),
  getMoviesByLanguage: (language) => api.get(`/movies/getmoviesbylanguage?language=${language}`),
  getMoviesByTitle: (title) => api.get(`/movies/getmoviesbytitle?title=${title}`),
  addMovie: (movieFormData) => api.post('/movies/addmovie', movieFormData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMovie: (id, movieFormData) => api.put(`/movies/updatemovie/${id}`, movieFormData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMovie: (id) => api.delete(`/movies/deletemovie/${id}`),
};

// Show Service
export const showService = {
  getAllShows: () => api.get('/show/getallshows'),
  getShowsByMovie: (movieId) => api.get(`/show/getshowsbymovie/${movieId}`),
  getShowsByTheatre: (theatreId) => api.get(`/show/getshowsbytheatre/${theatreId}`),
  getOccupiedSeats: (showId) => api.get(`/show/${showId}/seats`),
  createShow: (showData) => api.post('/show/createshow', showData),
  updateShow: (id, showData) => api.put(`/show/updateshow/${id}`, showData),
  deleteShow: (id) => api.delete(`/show/deleteshow/${id}`),
};

// Theatre Service
export const theatreService = {
  getTheatreByLocation: (location) => api.get(`/theatre/gettheatrebylocation?theatreLocation=${location}`),
  addTheatre: (theatreData) => api.post('/theatre/addtheatre', theatreData),
  updateTheatre: (id, theatreData) => api.put(`/theatre/updatetheatre/${id}`, theatreData),
  deleteTheatre: (id) => api.delete(`/theatre/deletetheatre/${id}`),
};

// Booking Service
export const bookingService = {
  createBooking: (bookingData) => api.post('/booking/createbooking', bookingData),
  getUserBookings: (userId) => api.get(`/booking/getuserbooking/${userId}`),
  getShowBookings: (showId) => api.get(`/booking/getshowbooking/${showId}`),
  confirmBooking: (id) => api.put(`/booking/${id}/confirm`),
  cancelBooking: (id) => api.put(`/booking/${id}/cancel`),
  getBookingByStatus: (status) => api.get(`/booking/getbookingbystatus/${status}`),
};

export default api;
