// client/src/components/landing/Landing.tsx
import { CodeDisplay } from "../CodeDisplay";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const snippet = `# Start the lab
pnpm run dev
# Open in browser
http://localhost:4200`;

  return (
    <main className="min-h-screen bg-tactical-background text-tactical-text-primary font-tactical">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Backend2Lab
        </h1>
        <p className="text-tactical-text-secondary max-w-2xl mx-auto">
          Hands-on backend labs in a tactical, cyberpunk UI. Learn Node.js +
          Express by doing, not just reading.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onStart}
            className="btn-tactical-primary"
          >
            Start Learning
          </button>
          <a
            href="https://github.com/backend2lab/backend2lab"
            className="btn-tactical-secondary"
          >
            View Repo
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="tactical-card hover-lift-tactical p-6">
          <h3 className="problem-title-tactical mb-2">⚡ Real Stack</h3>
          <p className="tactical-label">
            Node.js + Express services, running against a live API.
          </p>
        </article>
        <article className="tactical-card hover-lift-tactical p-6">
          <h3 className="problem-title-tactical mb-2">💻 Code & Console</h3>
          <p className="tactical-label">
            In-browser editor with instant feedback and execution console.
          </p>
        </article>
        <article className="tactical-card hover-lift-tactical p-6">
          <h3 className="problem-title-tactical mb-2">🎯 Guided Modules</h3>
          <p className="tactical-label">
            Structured labs and exercises with test validation.
          </p>
        </article>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-4">
        <h2 className="tactical-section-header">
          Get started in seconds
        </h2>
        <CodeDisplay code={snippet} language="bash" showLineNumbers={false} />
      </section>

      {/* Call To Action */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <button
          onClick={onStart}
          className="btn-tactical-primary"
        >
          Open the Lab
        </button>
      </section>
    </main>
  );
}
