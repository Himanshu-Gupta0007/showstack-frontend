import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react"; // Clerk auth

const Dashboard = () => {
  const { getToken } = useAuth(); // Clerk se token lene ke liye
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Clerk token get karo
        const token = await getToken({ template: "admin" }); // template agar specific hai
        if (!token) throw new Error("Admin token not found");

        // API call with Authorization
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Dashboard API response:", res.data);

        if (!res.data.success) {
          setError(res.data.message || "Access denied");
          return;
        }

        setDashboardData(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response) {
          setError(err.response.data?.message || `Error ${err.response.status}`);
        } else {
          setError(err.message || "Network error or server down");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [getToken]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        ⏳ Loading dashboard...
      </p>
    );
  if (error)
    return (
      <p
        style={{
          color: "#ff4d4f",
          textAlign: "center",
          marginTop: "50px",
          fontSize: "18px",
        }}
      >
        ❌ {error}
      </p>
    );
  if (!dashboardData)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        ❌ No data available
      </p>
    );

  const { overview = [], activeShows = [], recentActivity = [] } = dashboardData;

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1300px",
        margin: "auto",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#f1f5f9",
      }}
    >
      {/* ===== Header ===== */}
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            marginBottom: "10px",
            color: "#0ea5e9",
          }}
        >
          🎬 Admin Dashboard
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#94a3b8" }}>
          Monitor your movie shows, bookings, and overall platform activity at
          a glance.
        </p>
      </header>

      {/* ===== Overview Cards ===== */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "25px",
        }}
      >
        {overview.map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "#1e293b",
              borderRadius: "14px",
              padding: "25px 20px",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
            }}
          >
            <p style={{ fontSize: "28px", marginBottom: "10px" }}>{stat.icon}</p>
            <p style={{ fontSize: "24px", fontWeight: "700", marginBottom: "5px" }}>
              {stat.value}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{stat.title}</p>
          </div>
        ))}
      </section>

      {/* ===== Active Shows ===== */}
      <section style={{ marginTop: "50px" }}>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            color: "#0ea5e9",
          }}
        >
          🎟️ Active Shows
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {activeShows.length === 0 && <p>No active shows currently.</p>}
          {activeShows.map((show) => (
            <div
              key={show._id}
              style={{
                background: "#334155",
                borderRadius: "12px",
                width: "240px",
                padding: "15px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                transition: "transform 0.2s",
              }}
            >
              <img
                src={show.poster}
                alt={show.movieTitle}
                style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
              />
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                {show.movieTitle}
              </h3>
              <p style={{ marginBottom: "4px" }}>
                🎟️ Price: <strong>₹{show.price}</strong>
              </p>
              <p style={{ marginBottom: "4px" }}>
                🗓️ Date: {new Date(show.showDate).toLocaleDateString("en-IN")}
              </p>
              <p style={{ marginBottom: "4px" }}>⏰ Time: {show.showTime}</p>
              <p style={{ marginBottom: "4px" }}>
                Seats: {show.bookedSeats}/{show.totalSeats} ({show.occupancy}%)
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Recent Activity ===== */}
      <section style={{ marginTop: "50px" }}>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            color: "#0ea5e9",
          }}
        >
          📝 Recent Bookings
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {recentActivity.length === 0 && <p>No recent bookings available.</p>}
          {recentActivity.map((act, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "15px",
                background: "#1e293b",
                borderRadius: "12px",
                padding: "15px",
                alignItems: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
              }}
            >
              <p style={{ fontSize: "28px" }}>{act.icon}</p>
              <div>
                <p
                  style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "3px" }}
                >
                  {act.title}
                </p>
                <p style={{ color: "#94a3b8", marginBottom: "3px" }}>{act.description}</p>
                <p style={{ fontSize: "0.95rem", marginBottom: "2px" }}>
                  🎬 Movie: {act.movie}
                </p>
                <p style={{ fontSize: "0.95rem", marginBottom: "2px" }}>🕒 Time: {act.time}</p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: act.status === "Cancelled" ? "#f87171" : "#34d399",
                  }}
                >
                  Status: {act.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
