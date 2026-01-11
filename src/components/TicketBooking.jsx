import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/bookings`;


const TicketBooking = ({ movie, onBookingSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // ✅ Date added
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const times = ["10:00 AM", "1:30 PM", "5:00 PM", "9:00 PM"];
  const seats = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleConfirm = async () => {
    if (!selectedDate) return toast.error("Show date select kar");
    if (!selectedTime) return toast.error("Show time select kar");
    if (!selectedSeats.length) return toast.error("Seat select kar");

    setLoading(true);

    const payload = {
       movieId: movie._id || movie.id,
  showDate: new Date(selectedDate), // convert string to Date object
  showTime: selectedTime,
  seats: selectedSeats,
  pricePerSeat: movie.price || 250,
    };

    try {
      const { data } = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        toast.success(`🎉 ${selectedSeats.length} ticket${selectedSeats.length > 1 ? "s" : ""} booked!`);
        setShowModal(false);
        setSelectedSeats([]);
        setSelectedTime("");
        setSelectedDate("");
        onBookingSuccess?.(data.data);
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const total = selectedSeats.length * (movie.price || 250);

  return (
    <>
      <button className="buy-btn" onClick={() => setShowModal(true)}>
        Buy Ticket
      </button>

      {showModal && (
        <div className="ticket-modal">
          <div className="ticket-box">
            <h3>{movie.title}</h3>
            <p className="subtitle">Select Date, Time & Seats</p>

            {/* DATE */}
            <div className="section">
              <label>Show Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* TIME */}
            <div className="section">
              <label>Show Time</label>
              <div className="time-grid">
                {times.map((t) => (
                  <button
                    key={t}
                    className={selectedTime === t ? "active" : ""}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* SEATS */}
            <div className="section">
              <label>Seats</label>
              <div className="seat-grid">
                {seats.map((s) => (
                  <button
                    key={s}
                    className={selectedSeats.includes(s) ? "active" : ""}
                    onClick={() => toggleSeat(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="booking-summary">
              <div className="summary-row">
                <span>Seats:</span>
                <strong>{selectedSeats.join(", ") || "-"}</strong>
              </div>
              <div className="summary-row">
                <span>Price / seat:</span>
                <strong>₹{movie.price || 250}</strong>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <strong>₹{total}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : `Confirm ₹${total}`}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {/* CSS */}
            <style>{`
              .ticket-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
              }
              .ticket-box {
                background: linear-gradient(145deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98));
                padding: 28px;
                border-radius: 20px;
                width: 400px;
                max-width: 90vw;
                display: flex;
                flex-direction: column;
                gap: 18px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(139, 92, 246, 0.2);
              }
              .ticket-box h3 {
                margin: 0;
                font-size: 22px;
                color: white;
                text-align: center;
              }
              .subtitle {
                text-align: center;
                color: #9ca3af;
                font-size: 14px;
                margin: -8px 0 8px;
              }
              .section {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
              .section label {
                font-size: 14px;
                color: #d1d5db;
                font-weight: 600;
              }
              .time-grid,
              .seat-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
              }
              .time-grid button,
              .seat-grid button {
                padding: 10px 14px;
                border-radius: 10px;
                border: 2px solid #4b5563;
                background: rgba(75, 85, 99, 0.3);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
              }
              .time-grid button:hover,
              .seat-grid button:hover {
                border-color: #8b5cf6;
                transform: translateY(-2px);
              }
              .time-grid button.active,
              .seat-grid button.active {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                border-color: #8b5cf6;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
              }
              .booking-summary {
                background: rgba(139, 92, 246, 0.1);
                padding: 14px;
                border-radius: 12px;
                border: 1px solid rgba(139, 92, 246, 0.3);
              }
              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                color: #d1d5db;
                font-size: 14px;
              }
              .summary-row.total {
                border-top: 1px solid rgba(139, 92, 246, 0.3);
                margin-top: 8px;
                padding-top: 12px;
                font-size: 16px;
                color: white;
                font-weight: bold;
              }
              .modal-actions {
                display: flex;
                gap: 12px;
                margin-top: 8px;
              }
              .modal-actions button {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.2s;
              }
              .confirm-btn {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                color: white;
              }
              .confirm-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
              }
              .confirm-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }
              .cancel-btn {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 2px solid #ef4444;
              }
              .cancel-btn:hover:not(:disabled) {
                background: rgba(239, 68, 68, 0.35);
              }
              input[type="date"] {
                padding: 8px;
                border-radius: 8px;
                border: 1px solid #4b5563;
                background: rgba(255, 255, 255, 0.05);
                color: white;
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketBooking;
