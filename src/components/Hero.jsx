import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Background - You can later change to <video> for even better effect */}
      <img
        src="https://svgfilesforcricut.com/cdn/shop/files/2_27579821-51c1-43b0-8390-646f34615c2e.jpg?v=1718644408&width=1946"
        // Better quality dramatic image (Guardians style cosmic vibe)
        alt="Guardians of the Galaxy cosmic background"
        className="hero-bg"
      />

      {/* Stronger cinematic overlay */}
      <div className="hero-overlay">
        <h1 className="hero-title">Guardians of the Galaxy</h1>

        <div className="hero-subtitle">2026 • Action • Adventure • Sci-Fi</div>

        <div className="hero-meta">
          <span>PG-13</span>
          <span>2h 19m</span>
          <span>★ 8.1</span>
        </div>

        <p className="hero-desc">
          Brash space outlaw Peter Quill finds himself the quarry of relentless
          bounty hunters after he steals an orb coveted by Ronan, a powerful
          villain with ambitions that threaten the entire universe.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-btn primary"
            onClick={() => navigate("/movies")}
          >
            ▶️ Watch Trailer
          </button>

          
        </div>
      </div>
    </section>
  );
};

export default Hero;