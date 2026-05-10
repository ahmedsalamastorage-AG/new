import React from 'react';

export default function Dashboard() {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="animate-fade-in">Overview</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Welcome back to the Dr.IT portal.</p>
        </div>
        <button className="btn btn-primary animate-fade-in">New Quotation</button>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Inventory Value</p>
          <h2 style={{ marginTop: '0.5rem' }}>$1,245,000</h2>
          <p style={{ color: 'var(--accent-success)', fontSize: '0.75rem', marginTop: '0.5rem' }}>+5% from last month</p>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Quotes</p>
          <h2 style={{ marginTop: '0.5rem' }}>24</h2>
          <p style={{ color: 'var(--accent-warning)', fontSize: '0.75rem', marginTop: '0.5rem' }}>8 pending approval</p>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Campaigns</p>
          <h2 style={{ marginTop: '0.5rem' }}>3</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>AI optimization running</p>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.4s' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: i !== 3 ? '1px solid var(--border-color)' : 'none' }}>
              <div>
                <p style={{ fontWeight: 500 }}>Dell PowerEdge R740 added</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Inventory Update • By Ahmed</p>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>2h ago</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
