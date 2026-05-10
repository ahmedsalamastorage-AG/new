'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Customer = { id: string; company_name: string };
type Product = { id: string; name: string; brand: string; price: number; quantity: number };

type QuoteItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export default function NewQuotePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Temp state for adding a line item
  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemQty, setItemQty] = useState('1');

  useEffect(() => {
    async function loadData() {
      const [customersRes, productsRes] = await Promise.all([
        supabase.from('customers').select('id, company_name').order('company_name'),
        supabase.from('products').select('id, name, brand, price, quantity').order('name'),
      ]);
      if (customersRes.data) setCustomers(customersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  function addItem() {
    if (!selectedProduct || !itemQty) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(itemQty);
    if (qty <= 0) return;

    // Check if product already in items
    if (items.find((i) => i.product_id === selectedProduct)) {
      alert('Product already added. Remove it first to change quantity.');
      return;
    }

    setItems([
      ...items,
      {
        product_id: product.id,
        product_name: `${product.name} (${product.brand})`,
        quantity: qty,
        unit_price: product.price,
        total_price: qty * product.price,
      },
    ]);
    setSelectedProduct('');
    setItemQty('1');
  }

  function removeItem(productId: string) {
    setItems(items.filter((i) => i.product_id !== productId));
  }

  const grandTotal = items.reduce((sum, item) => sum + item.total_price, 0);

  async function handleSubmit() {
    if (!selectedCustomer) {
      alert('Please select a customer.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one product.');
      return;
    }

    setSubmitting(true);

    // 1. Create the quote
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .insert([{ customer_id: selectedCustomer, status: 'draft', total_amount: grandTotal }])
      .select()
      .single();

    if (quoteError || !quoteData) {
      console.error('Error creating quote:', quoteError);
      alert('Failed to create quote. Check console for details.');
      setSubmitting(false);
      return;
    }

    // 2. Insert quote items
    const quoteItems = items.map((item) => ({
      quote_id: quoteData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase.from('quote_items').insert(quoteItems);
    if (itemsError) {
      console.error('Error adding quote items:', itemsError);
      alert('Quote created but failed to add items.');
    } else {
      alert('Quotation created successfully!');
    }

    setSubmitting(false);
    router.push('/sales');
  }

  function formatNumber(n: number): string {
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="animate-fade-in">Create Quotation</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Build a new quote for a customer.</p>
        </div>
        <button onClick={() => router.push('/sales')} className="btn btn-secondary animate-fade-in">
          ← Back to Sales
        </button>
      </header>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading data...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Customer Selection */}
          <section className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
            <h3 style={{ marginBottom: '1rem' }}>1. Select Customer</h3>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'white',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <option value="">-- Choose a customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
            {customers.length === 0 && (
              <p style={{ color: 'var(--accent-warning)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                ⚠ No customers found. Add customers first from the Customers page.
              </p>
            )}
          </section>

          {/* Add Products */}
          <section className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.2s' }}>
            <h3 style={{ marginBottom: '1rem' }}>2. Add Products</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'white',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <option value="">-- Select product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand}) — ${formatNumber(p.price)} | Stock: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 0, minWidth: '100px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'white',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
              <button onClick={addItem} className="btn btn-primary" style={{ minWidth: '120px' }}>
                + Add Item
              </button>
            </div>
          </section>

          {/* Quote Items Table */}
          <section className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.3s' }}>
            <h3 style={{ marginBottom: '1rem' }}>3. Quote Summary</h3>
            {items.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No items added yet.</p>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '1rem' }}>Product</th>
                        <th style={{ padding: '1rem' }}>Unit Price</th>
                        <th style={{ padding: '1rem' }}>Qty</th>
                        <th style={{ padding: '1rem' }}>Total</th>
                        <th style={{ padding: '1rem' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.product_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem', fontWeight: 500 }}>{item.product_name}</td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>${formatNumber(item.unit_price)}</td>
                          <td style={{ padding: '1rem' }}>{item.quantity}</td>
                          <td style={{ padding: '1rem', fontWeight: 500 }}>${formatNumber(item.total_price)}</td>
                          <td style={{ padding: '1rem' }}>
                            <button
                              onClick={() => removeItem(item.product_id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-danger)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontFamily: 'var(--font-sans)',
                              }}
                            >
                              ✕ Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Grand Total</p>
                    <h2 style={{ color: 'var(--accent-success)', marginTop: '0.25rem' }}>${formatNumber(grandTotal)}</h2>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button onClick={() => router.push('/sales')} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || items.length === 0 || !selectedCustomer}
              className="btn btn-primary"
              style={{
                opacity: submitting || items.length === 0 || !selectedCustomer ? 0.5 : 1,
                cursor: submitting || items.length === 0 || !selectedCustomer ? 'not-allowed' : 'pointer',
                minWidth: '180px',
              }}
            >
              {submitting ? 'Creating...' : '✓ Create Quotation'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
