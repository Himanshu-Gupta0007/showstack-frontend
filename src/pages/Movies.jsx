import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

import TicketBooking from "../components/TicketBooking";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔥 ADD BOOKING API
  const addBooking = async (booking) => {
    try {
      const token = await getToken();
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`
, booking, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Booking API error:", err.response?.data || err.message);
      throw err;
    }
  };

  // 🔥 Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies`
);
        const data = await res.json();
        if (res.ok && data.success) setMovies(data.data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Selected movie
  useEffect(() => {
    if (id) {
      const movie = movies.find((m) => m._id.toString() === id);
      setSelectedMovie(movie || null);
    } else {
      setSelectedMovie(null);
    }
  }, [id, movies]);

  return (
    <>
      <style>{`
        .page { padding: 32px 20px; max-width: 1400px; margin: auto; }
        .page-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 24px; }
        .movie-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); gap:28px; }
        .movie-card { background: rgba(17,24,39,0.85); border-radius:18px; overflow:hidden; transition: all 0.35s ease; box-shadow:0 10px 30px rgba(0,0,0,0.35);}
        .movie-card:hover { transform: translateY(-8px) scale(1.02); box-shadow:0 18px 45px rgba(0,0,0,0.55);}
        .movie-img-wrapper { position: relative; overflow: hidden; }
        .movie-img-wrapper img { width:100%; height:360px; object-fit:cover; transition: transform 0.6s ease; }
        .movie-card:hover img { transform: scale(1.08); }
        .overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.35), rgba(0,0,0,0.05)); display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:14px; padding:22px; opacity:0; transition: opacity 0.4s ease; }
        .movie-card:hover .overlay { opacity:1; }
        .details-btn, .buy-btn { width:100%; padding:12px 0; border-radius:12px; font-weight:600; cursor:pointer; }
        .details-btn { background:transparent; color:white; border:1px solid rgba(255,255,255,0.35);}
        .details-btn:hover { background: rgba(255,255,255,0.15); }
        .buy-btn { background:linear-gradient(135deg,#ec4899,#8b5cf6); color:white; border:none; }
        .buy-btn:hover { transform: translateY(-2px); }
        .movie-info { padding:16px; }
        .movie-info h3 { font-size:1.05rem; font-weight:600; }
        .price { color:#22c55e; font-weight:600; }
        .rating { color:#facc15; font-size:0.9rem; }
        .duration, .release-year { position:absolute; top:12px; padding:6px 10px; font-size:0.7rem; border-radius:8px; background: rgba(0,0,0,0.55); color:white;}
        .duration { left:12px; }
        .release-year { right:12px; }
      `}</style>

      <div className="page">
        <h1 className="page-title">Movies</h1>

        <div className="movie-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="movie-card skeleton">
                  <div className="img-skeleton"></div>
                  <div className="text-skeleton"></div>
                </div>
              ))
            : movies.map((movie) => (
                <div className="movie-card" key={movie._id}>
                  <div className="movie-img-wrapper">
                    <img src={movie.poster} alt={movie.title} />

                    <div className="overlay">
                      <button
                        className="details-btn"
                        onClick={() => navigate(`/movies/${movie._id}`)}
                      >
                        Details
                      </button>

                      {/* <TicketBooking movie={movie} addBooking={addBooking} /> */}
                    </div>

                    {movie.duration && <span className="duration">{movie.duration}</span>}
                    {movie.release && <span className="release-year">{movie.release}</span>}
                  </div>

                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    {movie.price && <span className="price">₹{movie.price}</span>}
                    {movie.rating && <span className="rating">⭐ {movie.rating}</span>}
                  </div>
                </div>
              ))}
        </div>

        {/* My Bookings below movies */}
        
      </div>
    </>
  );
};

export default Movies;
