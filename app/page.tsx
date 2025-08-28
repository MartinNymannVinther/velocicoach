import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="font-sans">
 
      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: "url('/images/hero-cyclist.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-2xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Take your cycling to the next level.
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Get personalized training plans for your cycling goals and track
            your progress with ease.
          </p>
          <Link
            href="/signup"
            className="bg-accent text-black px-6 py-3 rounded-full font-semibold text-lg hover:bg-yellow-400 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="py-20 px-8 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="text-center">
            <Image
              src="/images/goal.jpg"
              alt="Choose your goal"
              width={400}
              height={250}
              className="rounded-xl shadow-md mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4">Choose your goal</h3>
            <p className="text-gray-600 mt-2">
              Select your experience level and cycling objective.
            </p>
          </div>

          <div className="text-center">
            <Image
              src="/images/plan.jpg"
              alt="Follow your plan"
              width={400}
              height={250}
              className="rounded-xl shadow-md mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4">Follow your plan</h3>
            <p className="text-gray-600 mt-2">
              Get your personalized plan and start training.
            </p>
          </div>

          <div className="text-center">
            <Image
              src="/images/progress.jpg"
              alt="Track your progress"
              width={400}
              height={250}
              className="rounded-xl shadow-md mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4">Track your progress</h3>
            <p className="text-gray-600 mt-2">
              Analyze your ride data and improve your performance.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
