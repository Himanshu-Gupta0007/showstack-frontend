import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import "react-toastify/dist/ReactToastify.css";

const Bookings = () => {
  

  const { getToken } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================
      🔥 FETCH ALL BOOKINGS (ADMIN)
  ======================= */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const token = await getToken();
        if (!token) throw new Error("Auth token not found");

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/bookings`
,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Bookings API:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Bookings load nahi ho rahi 😔");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [getToken]);

  /* =======================
      💰 TOTAL EARNINGS
  ======================= */
  const totalEarnings = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  /* =======================
      🧠 UI
  ======================= */
  return (
    <div
      style={{
        maxWidth: "1300px",
        margin: "auto",
        padding: "24px",
        color: "#e5e7eb",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "#38bdf8" }}>
        📑 All Bookings ({bookings.length})
      </h1>

      {loading && <p>⏳ Loading bookings...</p>}
      {!loading && bookings.length === 0 && <p>❌ No bookings found</p>}

      {/* 💰 Earnings */}
      {!loading && bookings.length > 0 && (
        <div
          style={{
            background: "#020617",
            padding: "18px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span style={{ fontSize: "2.2rem" }}>💰</span>
          <div>
            <h3 style={{ margin: 0 }}>Total Earnings</h3>
            <p style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
              ₹{totalEarnings.toLocaleString("en-IN")}
            </p>
            <small>{bookings.length} bookings</small>
          </div>
        </div>
      )}

      {/* 📋 BOOKINGS TABLE */}
      {!loading && bookings.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#020617",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#020617" }}>
              <tr>
                <th>Poster</th>
                <th>User ID</th>
                <th>Movie</th>
                <th>Date & Time</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} style={{ textAlign: "center" }}>
                  <td>
                  
  

                  </td>

                  <td style={{ fontSize: "0.8rem" }}>{b.userId}</td>

                  <td>{b.movie?.title || "N/A"}</td>

                  <td>
                    {new Date(b.show?.showDate).toLocaleDateString("en-IN")}
                    <br />
                    <small>{b.show?.showTime}</small>
                  </td>

                  <td>{b.seats?.join(", ")}</td>

                  <td>₹{b.pricePerSeat}</td>

                  <td style={{ fontWeight: "bold" }}>
                    ₹{b.totalAmount.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background:
                          b.bookingStatus === "cancelled"
                            ? "#7f1d1d"
                            : "#064e3b",
                      }}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bookings;
