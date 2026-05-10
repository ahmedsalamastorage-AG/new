import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <h2 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>Dr.IT</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Management System</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>📊 Dashboard</Link>
          <Link href="/inventory" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>📦 Inventory</Link>
          <Link href="/customers" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>👥 Customers</Link>
          <Link href="/sales" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>💼 Sales</Link>
          <Link href="/marketing" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>📢 Marketing</Link>
          <Link href="/ai-assistant" className="btn btn-secondary" style={{ justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>🤖 AI Assistant</Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>System Status</p>
            <p style={{ color: 'var(--accent-success)', fontSize: '0.75rem', marginTop: '0.25rem' }}>● All systems operational</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
