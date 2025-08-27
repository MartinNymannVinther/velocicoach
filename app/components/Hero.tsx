export default function Hero() {
  return (
    <section className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold mb-6">VelociCoach 🚴</h1>
      <p className="text-xl mb-8">
        Din digitale cykeltræner – personlig træning, tilpasset dig.
      </p>
      <a href="#onboarding">
        <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold text-lg hover:bg-yellow-500 transition">
          Kom i gang – vælg dit niveau
        </button>
      </a>
    </section>
  );
}
