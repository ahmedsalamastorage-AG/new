'use client';

import React, { useState } from 'react';

type Campaign = {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  reach: number;
  leads: number;
  startDate: string;
};

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Ramadan Server Sale', platform: 'Facebook', status: 'active', reach: 12400, leads: 34, startDate: '2026-03-15' },
  { id: '2', name: 'Q2 Switch Clearance', platform: 'LinkedIn', status: 'active', reach: 5200, leads: 18, startDate: '2026-04-01' },
  { id: '3', name: 'New Admin Capital Pitch', platform: 'Email', status: 'draft', reach: 0, leads: 0, startDate: '2026-05-10' },
  { id: '4', name: 'Cisco Equipment Promo', platform: 'Facebook', status: 'completed', reach: 28900, leads: 67, startDate: '2026-01-20' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' },
  paused: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' },
  completed: { bg: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-muted)' },
  draft: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
};

function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function MarketingPage() {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="animate-fade-in">📢 Marketing</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage campaigns and AI-powered content.</p>
        </div>
        <button className="btn btn-primary animate-fade-in">+ New Campaign</button>
      </header>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Campaigns</p>
          <h2 style={{ marginTop: '0.5rem' }}>{fmt(campaigns.filter(c => c.status === 'active').length)}</h2>
          <p style={{ color: 'var(--accent-success)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Running now</p>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Reach</p>
          <h2 style={{ marginTop: '0.5rem' }}>{fmt(campaigns.reduce((sum, c) => sum + c.reach, 0))}</h2>
          <p style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Across all campaigns</p>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Leads</p>
          <h2 style={{ marginTop: '0.5rem' }}>{fmt(campaigns.reduce((sum, c) => sum + c.leads, 0))}</h2>
          <p style={{ color: 'var(--accent-warning)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Conversion tracking</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <section className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>All Campaigns</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Campaign</th>
                <th style={{ padding: '1rem' }}>Platform</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Reach</th>
                <th style={{ padding: '1rem' }}>Leads</th>
                <th style={{ padding: '1rem' }}>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{campaign.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem' }}>
                      {campaign.platform}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      backgroundColor: STATUS_STYLES[campaign.status].bg,
                      color: STATUS_STYLES[campaign.status].color,
                    }}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{fmt(campaign.reach)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: campaign.leads > 0 ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                      {campaign.leads}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Content Ideas */}
      <section className="glass-panel animate-fade-in" style={{ padding: '2rem', marginTop: '1.5rem', animationDelay: '0.2s' }}>
        <h3 style={{ marginBottom: '1rem' }}>🤖 AI-Suggested Content Ideas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Facebook Post — Arabic', desc: '"عرض خاص على سيرفرات Dell المجددة — اتصل الآن!"', type: 'Social Media' },
            { title: 'LinkedIn Article', desc: 'Why Egyptian SMEs Should Consider Refurbished Datacenter Equipment', type: 'Content Marketing' },
            { title: 'Email Campaign', desc: 'Q2 Clearance Sale — Up to 40% off Cisco Networking Equipment', type: 'Email Blast' },
          ].map((idea, i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{idea.type}</span>
              <h4 style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{idea.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>{idea.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
