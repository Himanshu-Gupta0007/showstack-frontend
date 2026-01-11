import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================
      🔥 FETCH MOVIES
  ======================= */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies`
, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("Movies API Response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Movies fetch failed");
        }

        const moviesArray =
          data.movies ||
          data.data?.movies ||
          data.data ||
          (Array.isArray(data) ? data : []);

        setMovies(moviesArray);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Movies load nahi ho rahi 😔");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  /* =======================
      🧠 UI
  ======================= */
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Segoe UI, sans-serif",
        color: "#f1f5f9",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "#0ea5e9" }}>
        🎥 Manage Movies ({movies.length})
      </h1>

      {loading && <p>⏳ Movies load ho rahi hain...</p>}
      {!loading && movies.length === 0 && <p>❌ Koi movie nahi mili</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {movies.map((movie, index) => (
          <div
            key={movie._id}
            style={{
              position: "relative", // 🔥 IMPORTANT
              background: "#1e293b",
              borderRadius: "10px",
              width: "200px",
              padding: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {/* ✅ ACTIVE BADGE */}
            {movie.isActive && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#22c55e",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                ✔ Active
              </div>
            )}

            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              #{index + 1}
            </div>

            <img
              src={movie.poster || "https://via.placeholder.com/200x300"}
              alt={movie.title}
              style={{
                width: "100%",
                height: "280px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            />

            <h3 style={{ fontSize: "1rem", marginBottom: "4px" }}>
              {movie.title}
            </h3>

            <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
              🕒 {movie.shows?.length || 0} Active Shows
            </p>

            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "6px",
                  background: "#0ea5e9",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => toast.info("Edit feature coming soon")}
              >
                ✏️ Edit
              </button>

              <button
                style={{
                  flex: 1,
                  padding: "6px",
                  background: "#f87171",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => toast.warn("Delete feature coming soon")}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
