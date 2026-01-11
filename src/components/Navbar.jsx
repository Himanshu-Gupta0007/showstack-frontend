import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">EX</Link>

        {/* Links */}
        <ul className="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/theaters">Theaters</Link></li>
          <li><Link to="/releases">Releases</Link></li>

          {/* ✅ My Bookings */}
          {/* <li><Link to="/my-bookings">My Bookings</Link></li> */}
        </ul>

        {/* Auth */}
        <div className="auth">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="login-btn">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
