import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addshow = () => {
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [price, setPrice] = useState("");           // Ticket Price
  const [totalSeats, setTotalSeats] = useState(""); // Total Seats
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");

  const [loading, setLoading] = useState(false);

  /* =======================
     🔥 FETCH MOVIES
  ======================= */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies`)

        const data = await res.json();

        console.log("Movies API Response:", data);

        let moviesArray = [];
        if (Array.isArray(data)) moviesArray = data;
        else if (Array.isArray(data.movies)) moviesArray = data.movies;
        else if (Array.isArray(data.data)) moviesArray = data.data;
        else if (Array.isArray(data.data?.movies)) moviesArray = data.data.movies;

        setMovies(moviesArray);
      } catch (err) {
        console.error(err);
        toast.error("Movies load nahi ho rahi 😔");
        setMovies([]);
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchMovies();
  }, []);

  /* =======================
     🎬 SELECT MOVIE
  ======================= */
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setPrice("");
    setTotalSeats("");
    setShowDate("");
    setShowTime("");
  };

  /* =======================
     ⏰ HELPER: Convert 24-hour to 12-hour AM/PM
  ======================= */
  const to12HourFormat = (time24) => {
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  /* =======================
     ➕ ADD SHOW
  ======================= */
  const handleAddShow = async () => {
    if (!selectedMovie || !price || !totalSeats || !showDate || !showTime) {
      toast.error("Sab fields bharo pehle!");
      return;
    }

    setLoading(true);

    const payload = {
      movie: selectedMovie._id,
      price: Number(price),
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      showDate,
      showTime: to12HourFormat(showTime), // ✅ convert to AM/PM format
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shows/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Show add nahi hua");
      }

      toast.success(" Show successfully add ho gaya!");

      // Reset form
      setSelectedMovie(null);
      setPrice("");
      setTotalSeats("");
      setShowDate("");
      setShowTime("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Kuch galat ho gaya 😕");
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete =
    selectedMovie && price && totalSeats && showDate && showTime;

  /* =======================
     🧠 UI
  ======================= */
  return (
    <div className="addshow-page" style={{ maxWidth: "900px", margin: "auto", padding: "20px", fontFamily: "'Segoe UI', sans-serif", color: "#f1f5f9" }}>
      <h1 className="addshow-page-title" style={{ fontSize: "2rem", marginBottom: "20px", color: "#0ea5e9" }}>➕ Naya Show Add Karo</h1>

      <div className="movie-selection" style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "15px" }}>1. Movie Select Karo</h2>

        {moviesLoading && <p>⏳ Movies load ho rahi hain...</p>}

        {!moviesLoading && movies.length === 0 && <p>❌ Koi movie nahi mili</p>}

        <div className="movies-grid" style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {movies.map((movie) => (
            <div
              key={movie._id}
              className={`movie-select-card ${selectedMovie?._id === movie._id ? "selected" : ""}`}
              onClick={() => handleMovieSelect(movie)}
              style={{
                cursor: "pointer",
                border: selectedMovie?._id === movie._id ? "2px solid #0ea5e9" : "2px solid #334155",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
                width: "150px",
                transition: "transform 0.2s",
              }}
            >
              <img src={movie.poster} alt={movie.title} style={{ width: "100%", borderRadius: "6px", marginBottom: "5px" }} />
              <h3 style={{ fontSize: "0.95rem", marginBottom: "5px" }}>{movie.title}</h3>
              {selectedMovie?._id === movie._id && <span style={{ color: "#34d399", fontWeight: "bold" }}>✔ Selected</span>}
            </div>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <div className="show-form-container" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ marginBottom: "10px" }}>Selected Movie: {selectedMovie.title}</h3>

          <input
            type="number"
            placeholder="Ticket Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155" }}
          />

          <input
            type="number"
            placeholder="Total Seats (kitni seats hain hall mein)"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            min="1"
            required
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155" }}
          />

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155" }}
          />

          <input
            type="time"
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155" }}
          />

          <button
            disabled={!isFormComplete || loading}
            onClick={handleAddShow}
            style={{
              marginTop: "10px",
              padding: "12px",
              backgroundColor: isFormComplete ? "#0ea5e9" : "#64748b",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: isFormComplete ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "⏳ Add ho raha hai..." : " Show Add Karo"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Addshow;
