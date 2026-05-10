'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Quote = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  customers: { company_name: string };
};

export default function SalesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    // Fetch quotes joined with customers
    const { data, error } = await supabase
      .from('quotes')
      .select('id, status, total_amount, created_at, customers(company_name)')
      .order('created_at', { ascending: false });
      
    if (error) console.error("Error fetching quotes:", error);
    else setQuotes(data as any || []);
    setLoading(false);
  }

  async function convertToInvoice(quoteId: string, customerId: string, totalAmount: number) {
    if (!confirm('Are you sure you want to approve this quote and convert it to an invoice? This will deduct the items from inventory.')) return;
    
    // 1. Update quote status
    await supabase.from('quotes').update({ status: 'approved' }).eq('id', quoteId);
    
    // 2. Create invoice
    await supabase.from('invoices').insert([{
      quote_id: quoteId,
      customer_id: customerId,
      status: 'unpaid',
      total_amount: totalAmount
    }]);

    // 3. Deduct inventory (simplified: we'd normally do this in a Postgres Function to ensure atomicity)
    // For now, we fetch quote items and deduct one by one
    const { data: items } = await supabase.from('quote_items').select('product_id, quantity').eq('quote_id', quoteId);
    if (items) {
      for (const item of items) {
        // Fetch current product quantity
        const { data: prodData } = await supabase.from('products').select('quantity').eq('id', item.product_id).single();
        if (prodData) {
          await supabase.from('products').update({ quantity: prodData.quantity - item.quantity }).eq('id', item.product_id);
        }
      }
    }

    alert('Quote converted to Invoice successfully! Inventory updated.');
    fetchQuotes();
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="animate-fade-in">Sales & Quotes</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage quotations and invoices.</p>
        </div>
        <Link href="/sales/new-quote" className="btn btn-primary animate-fade-in">Create Quotation</Link>
      </header>

      <section className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Quotations</h2>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading quotes...</p>
        ) : quotes.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No quotes created yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Quote ID</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Total Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(quote => (
                  <tr key={quote.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{quote.id.substring(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{quote.customers?.company_name || 'Unknown'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(quote.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>${quote.total_amount.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem',
                        backgroundColor: quote.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                        color: quote.status === 'approved' ? 'var(--accent-success)' : 'inherit'
                      }}>
                        {quote.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {quote.status === 'draft' && (
                        <button 
                          onClick={() => convertToInvoice(quote.id, (quote as any).customer_id, quote.total_amount)}
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                        >
                          Approve & Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
