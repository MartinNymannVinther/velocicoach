export default function StyleGuide() {
  return (
    <main className="p-6 space-y-16 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">VelociCoach Styleguide 🚴</h1>
        <p className="text-neutral max-w-2xl mx-auto">
          Denne side fungerer som vores design reference – her samler vi farver, typografi og
          komponenter, så vi sikrer konsistens på tværs af hele applikationen.
        </p>
      </header>

      {/* Design Rationale */}
      <section className="bg-neutral-light rounded-lg p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4">Design Rationale</h2>
        <div className="space-y-4 text-sm leading-relaxed text-neutral-dark">
          <p>
            <strong>Farver:</strong> 
            Blå (primary) signalerer tillid og stabilitet, hvilket passer til en digital træner man kan stole på. 
            Gul (accent) giver energi og guider brugerens opmærksomhed. 
            Grå (neutral) skaber kontrast og ro, så indholdet er let at læse.
          </p>
          <p>
            <strong>Typografi:</strong> 
            Poppins er valgt som en moderne, rund sans-serif font, der føles venlig og letlæselig på både computer og mobil. 
            Overskrifter fremstår energiske, mens brødtekst er neutral og let at scanne.
          </p>
          <p>
            <strong>Knapper:</strong> 
            Det visuelle hierarki gør det tydeligt hvad der er den vigtigste handling: 
            primær (blå) = næste skridt, accent (gul) = særlige handlinger, neutral (grå) = sekundære funktioner. 
            Det reducerer risiko for fejlklik.
          </p>
          <p>
            <strong>Formularer:</strong> 
            Fokusfarven (blå ring) hjælper brugeren med hurtigt at finde det aktive felt, især på mobil. 
            Kontrasten mellem tekst og baggrund sikrer tilgængelighed og læsbarhed.
          </p>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Farver</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-6 rounded bg-primary text-white shadow">Primary</div>
          <div className="p-6 rounded bg-accent text-black shadow">Accent</div>
          <div className="p-6 rounded bg-neutral text-white shadow">Neutral</div>
          <div className="p-6 rounded bg-neutral-dark text-white shadow">Neutral Dark</div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Typografi</h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Overskrift 1 – Bold 4xl</h1>
          <h2 className="text-3xl font-semibold">Overskrift 2 – Semibold 3xl</h2>
          <h3 className="text-2xl font-medium">Overskrift 3 – Medium 2xl</h3>
          <p className="text-base">
            Dette er et eksempel på brødtekst. Her tester vi læsbarhed og spacing i forskellige skærmstørrelser.
          </p>
          <a href="#" className="underline text-primary hover:text-blue-600">
            Dette er et eksempel på et link
          </a>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Knapper</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow">
            Primær
          </button>
          <button className="bg-accent text-black px-5 py-2 rounded-lg hover:bg-yellow-400 shadow">
            Accent
          </button>
          <button className="bg-neutral text-white px-5 py-2 rounded-lg hover:bg-neutral-dark shadow">
            Neutral
          </button>
        </div>
      </section>

      {/* Form elements */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Formularfelter</h2>
        <form className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Navn</label>
            <input
              type="text"
              className="w-full border border-neutral-dark rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Indtast dit navn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-neutral-dark rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Indtast din email"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow"
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
