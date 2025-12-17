import Link from 'next/link';
import { Suspense } from 'react';

// Mock Data
const hospitals = [
    { id: '1', name: 'Charité Berlin', status: 'Training', progress: 45 },
    { id: '2', name: 'BIH (Berlin Institute of Health)', status: 'Idle', progress: 100 },
    { id: '3', name: 'Vivantes Klinikum', status: 'Syncing', progress: 12 },
    { id: '4', name: 'Startup A', status: 'Offline', progress: 0 },
];

export default function Dashboard() {
    return (
        <div className="page-wrapper">
            <div className="container">
                <header>
                    <div className="brand">Berlin<span>MedFL</span> Dashboard</div>
                    <nav>
                        <Link href="/" className="btn btn-secondary">Logout</Link>
                    </nav>
                </header>

                <main>
                    <section style={{ padding: '4rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Federated Training: <span style={{ color: 'var(--color-primary)' }}>Round #42</span></h2>
                            <div className="btn btn-primary">Download Global Model (v42.0)</div>
                        </div>

                        <div className="grid-3" style={{ margin: '2rem 0' }}>
                            <div className="card-glass">
                                <h3>Global Accuracy</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-action)' }}>89.4%</p>
                                <p>+2.1% since last round</p>
                            </div>
                            <div className="card-glass">
                                <h3>Participating Nodes</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>8/12</p>
                                <p>Active participants</p>
                            </div>
                            <div className="card-glass">
                                <h3>Next Aggregation</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>02:14:00</p>
                                <p>Time remaining</p>
                            </div>
                        </div>

                        <h3>Hospital Node Status</h3>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            {hospitals.map((h) => (
                                <div key={h.id} className="card-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{h.name}</h4>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: h.status === 'Training' ? 'var(--color-primary)' : 'hsla(0,0%,100%,0.1)',
                                            color: h.status === 'Training' ? '#000' : 'inherit',
                                            fontSize: '0.8rem'
                                        }}>
                                            {h.status}
                                        </span>
                                    </div>
                                    <div style={{ width: '200px' }}>
                                        <div style={{ height: '8px', background: 'hsla(0,0%,100%,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${h.progress}%`,
                                                height: '100%',
                                                background: 'var(--color-accent)',
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
