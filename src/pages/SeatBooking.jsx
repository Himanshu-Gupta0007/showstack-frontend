import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Example seat layout
const rows = ["A", "B", "C", "D"];
const cols = 10;

const SeatBooking = ({ showId, pricePerSeat }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch show booked seats
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/shows/${showId}`);
        const data = await res.json();
        if (res.ok) {
          setBookedSeats(data.data.bookedSeats || []);
        } else {
          toast.error(data.message || "Failed to load show");
        }
      } catch (err) {
        toast.error(err.message || "Network error");
      }
    };

    fetchShow();
  }, [showId]);

  // Toggle seat select
  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // cannot select booked seat
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Handle booking
  const handleBooking = async () => {
    if (selectedSeats.length === 0) return toast.error("Select at least 1 seat");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          showId,
          seats: selectedSeats,
          pricePerSeat,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Booking successful 🎉");
        setBookedSeats((prev) => [...prev, ...selectedSeats]);
        setSelectedSeats([]);
      } else {
        toast.error(data.message || "Booking failed 😔");
      }
    } catch (err) {
      toast.error(err.message || "Network error 😔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", textAlign: "center" }}>
      <h2>🎟️ Select Your Seats</h2>

      <div style={{ display: "grid", gap: 5, margin: "20px 0" }}>
        {rows.map((row) => (
          <div key={row} style={{ display: "flex", justifyContent: "center", gap: 5 }}>
            {Array.from({ length: cols }, (_, i) => {
              const seat = `${row}${i + 1}`;
              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: isBooked
                      ? "#777"
                      : isSelected
                      ? "#0ea5e9"
                      : "#1e293b",
                    color: "#fff",
                    border: "1px solid #0ea5e9",
                    borderRadius: 5,
                    cursor: isBooked ? "not-allowed" : "pointer",
                  }}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p>
        Selected Seats: {selectedSeats.join(", ") || "None"} | Total: ₹
        {selectedSeats.length * pricePerSeat}
      </p>

      <button
        onClick={handleBooking}
        disabled={loading || selectedSeats.length === 0}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0ea5e9",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default SeatBooking;
