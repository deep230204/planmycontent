function Footer() {
  return (
    <footer className="relative mt-16 sm:mt-20 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,124,53,0.08),transparent_35%),radial-gradient(circle_at_top_right,rgba(244,124,53,0.05),transparent_35%)]"></div>

      {/* Bottom Left Glow */}
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[#f47c35]/8 rounded-full blur-[100px]"></div>

      {/* Top Right Glow */}
      <div className="absolute top-0 right-0 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-[#f47c35]/6 rounded-full blur-[90px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-12 text-center">
        <p className="text-sm sm:text-base md:text-lg text-[#64748b] leading-relaxed max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto">
          Built for founders, coaches, creators & small marketing teams.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
