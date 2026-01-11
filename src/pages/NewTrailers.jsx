const trailers = [
  {
    id: 1,
    title: "Avengers: Endgame – Trailer",
    thumbnail: "https://img.youtube.com/vi/TcMBFSGVi1c/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
  },
  {
    id: 2,
    title: "The Batman – Official Trailer",
    thumbnail: "https://img.youtube.com/vi/mqqft2x_Aa4/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
  },
  {
    id: 3,
    title: "Joker – Official Trailer",
    thumbnail: "https://img.youtube.com/vi/zAGVQLHvwOY/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=zAGVQLHvwOY",
  },
  {
    id: 4,
    title: "Oppenheimer – Trailer",
    thumbnail: "https://img.youtube.com/vi/uYPbbksJxIg/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
  },
  {
    id: 5,
    title: "Dune Part Two – Trailer",
    thumbnail: "https://img.youtube.com/vi/U2Qp5pL3ovA/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=U2Qp5pL3ovA",
  },
  {
    id: 6,
    title: "Deadpool & Wolverine – Trailer",
    thumbnail: "https://img.youtube.com/vi/73_1biulkYk/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=73_1biulkYk",
  },
];

const NewTrailers = () => {
  return (
    <section className="trailers-section">
      <h2 className="section-title">🎬 New Trailers</h2>

      <div className="trailers-grid">
        {trailers.map((trailer) => (
          <a
            key={trailer.id}
            href={trailer.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="trailer-card"
          >
            <div className="trailer-img">
              <img src={trailer.thumbnail} alt={trailer.title} />
              <span className="play-icon">▶</span>
            </div>

            <p className="trailer-title">{trailer.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default NewTrailers;
