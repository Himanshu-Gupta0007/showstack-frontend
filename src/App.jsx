import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

/* ================= USER COMPONENTS ================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import NewTrailers from "./pages/NewTrailers";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Releases from "./pages/Releases";
import DateSelector from "./components/DateSelector";
import MyBookings from "./components/MyBookings";
import MovieDetails from "./pages/Details/MovieDetails";

/* ================= ADMIN COMPONENTS ================= */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminMovies from "./admin/Movies";
import Addshow from "./admin/Addshow";
import AdminBookings from "./admin/Bookings";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

/* ================= ROUTES CONTENT ================= */
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ✅ Global bookings state
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookings");
    if (stored) setBookings(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
    toast.success("🎟 Ticket Booked Successfully!");
  };

  const cancelBooking = (index) => {
    if (window.confirm("Are you sure you want to cancel this booking? ❌")) {
      setBookings((prev) => prev.filter((_, i) => i !== index));
      toast.info("🗑 Booking Cancelled!");
    }
  };

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <NewTrailers />
              <Movies addBooking={addBooking} />
              
            </>
          }
        />

        {/* USER PROTECTED */}
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies addBooking={addBooking} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movies/:id"
          element={
            <ProtectedRoute>
              <MovieDetails addBooking={addBooking} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <DateSelector addBooking={addBooking} />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED: MyBookings with props */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings
                bookings={bookings}
                onCancelBooking={cancelBooking}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/theaters"
          element={
            <ProtectedRoute>
              <Theaters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/releases"
          element={
            <ProtectedRoute>
              <Releases />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="add-show" element={<Addshow />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

/* ================= APP ================= */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
