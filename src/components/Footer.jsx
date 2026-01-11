const Footer = () => {
  return (
    <footer className="footer">
      {/* Top */}
      <div className="footer-top">
        <div>
          <div className="footer-logo"></div>
          <p className="footer-desc">
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <div className="footer-apps">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
              alt="Google Play" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/1024px-Download_on_the_App_Store_RGB_blk.svg.png?20180317110059" 
              alt="App Store" 
            />
          </div>
        </div>
      </div>

      {/* Middle */}
      <div className="footer-middle">
        <div className="footer-links">
          <span>Home</span>
          <span>About Us</span>
          <span>Contact Us</span>
          <span>Privacy Policy</span>
        </div>
        <div className="footer-contact">
          <span>Get in touch</span>
          <span>+1-234-567-890</span>
          <a href="mailto:contact@example.com">contact@example.com</a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        Copyright 2025 © MovieHub. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;
