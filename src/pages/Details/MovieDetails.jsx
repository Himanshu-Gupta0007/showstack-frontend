import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketBooking from "../../components/TicketBooking";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/${id}`
);
        const data = await res.json();
        if (res.ok && data.success) {
          setMovie(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // 🔥 LOADING UI (NOW IT WILL ACTUALLY SHOW)
  if (loading) {
    return (
      <div className="movie-details-page">
        <div className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="skeleton poster"></div>

              <div className="details">
                <div className="skeleton title"></div>
                <div className="skeleton meta"></div>
                <div className="skeleton text"></div>
                <div className="skeleton text short"></div>
                <div className="skeleton btn"></div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .movie-details-page {
            background: black;
            min-height: 100vh;
          }

          .skeleton {
            background: linear-gradient(
              90deg,
              #222 25%,
              #333 37%,
              #222 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
          }

          .skeleton.poster {
            width: 300px;
            height: 450px;
          }

          .skeleton.title {
            width: 60%;
            height: 50px;
            margin-bottom: 20px;
          }

          .skeleton.meta {
            width: 40%;
            height: 20px;
            margin-bottom: 20px;
          }

          .skeleton.text {
            width: 100%;
            height: 16px;
            margin-bottom: 12px;
          }

          .skeleton.text.short {
            width: 70%;
          }

          .skeleton.btn {
            width: 200px;
            height: 50px;
            margin-top: 30px;
          }

          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    );
  }

  // 🔥 REAL MOVIE UI
  return (
    <div className="movie-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div
        className="hero-section"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent),
            url(${movie.poster || movie.backdrop})
          `,
        }}
      >
        <div className="hero-container">
          <div className="hero-content">
            <div className="poster-box">
              <img src={movie.poster} alt={movie.title} />
            </div>

            <div className="details">
              <h1>{movie.title}</h1>

              <div className="meta">
                {movie.rating && (
                  <span className="rating">⭐ {movie.rating}/10</span>
                )}
                {movie.release && <span>{movie.release}</span>}
                {movie.duration && <span>{movie.duration}</span>}
              </div>

              {movie.genres && (
                <div className="genres">
                  {movie.genres.map((g, i) => (
                    <span key={i}>{g}</span>
                  ))}
                </div>
              )}

              <p className="description">
                {movie.description || "No description available."}
              </p>

              <div className="actions">
                <button className="trailer-btn">▶ Play Trailer</button>
                <TicketBooking movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .movie-details-page {
          background: black;
          color: white;
          min-height: 100vh;
        }

        .back-btn {
          position: fixed;
          top: 30px;
          left: 30px;
          z-index: 50;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
        }

        .hero-section {
          height: 100vh;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .hero-container {
          height: 100%;
          max-width: 1200px;
          margin: auto;
          padding: 0 32px 80px;
          display: flex;
          align-items: flex-end;
        }

        .hero-content {
          display: flex;
          gap: 48px;
        }

        .poster-box img {
          width: 300px;
          border-radius: 12px;
        }

        .details h1 {
          font-size: 56px;
          margin-bottom: 20px;
        }

        .rating {
          color: #22c55e;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MovieDetails;
