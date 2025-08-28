export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white px-6 py-4 flex justify-between items-center z-50 shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold">VelociCoach </div>
      {/* Links */}
      <div className="hidden md:flex space-x-6">
        <a href="/" className="hover:text-accent transition">Home</a>
        <a href="/features" className="hover:text-accent transition">Features</a>
        <a href="/pricing" className="hover:text-accent transition">Pricing</a>
      </div>

      {/* Login-knap */}
      <a
        href="/login"
        className="bg-accent text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition"
      >
        Log ind
      </a>
    </nav>
  );
}
