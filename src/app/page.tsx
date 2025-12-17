import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <header>
          <div className="brand">Berlin<span>MedFL</span> Hub</div>
          <nav>
            <Link href="/dashboard" className="btn btn-secondary">Hospital Login</Link>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section style={{ padding: '8rem 0', textAlign: 'center' }}>
            <h1>Federated Learning for<br />Rare Disease Prediction</h1>
            <p style={{ maxWidth: '600px', margin: '2rem auto' }}>
              Train global models on patient data without sharing raw files.
              Secure aggregation for Charité, BIH, and innovative startups.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/dashboard" className="btn btn-primary">Start Training Node</Link>
              <a href="#features" className="btn btn-secondary">View Architecture</a>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features">
            <div className="grid-3">
              <div className="card-glass">
                <h3>Privacy First</h3>
                <p>Data never leaves the hospital premise. Only model weights are shared via secure n8n pipelines.</p>
              </div>
              <div className="card-glass">
                <h3>Melloddy Compliant</h3>
                <p>Drug discovery standards built-in. Output shared models ready for validation.</p>
              </div>
              <div className="card-glass">
                <h3>FeTS Segmentation</h3>
                <p>Launch tumor segmentation pilots with state-of-the-art P2P updates.</p>
              </div>
            </div>
          </section>

          {/* Stats / Trust */}
          <section style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid hsla(0,0%,100%,0.1)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Trusted by Berlin&apos;s Health Ecosystem</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', opacity: 0.7 }}>
              <span>CHARITÉ</span>
              <span>BIH</span>
              <span>FRAUNHOFER HHI</span>
              <span>VIVANTES</span>
            </div>
          </section>
        </main>

        <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <p>&copy; 2025 Berlin MedFL Hub. All rights reserved. GDPR Compliant.</p>
        </footer>
      </div>
    </div>
  );
}
