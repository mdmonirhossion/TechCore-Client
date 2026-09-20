import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, Clock, Plus, User, Phone, Laptop } from 'lucide-react';

export default function ServiceCenter() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    productName: '',
    serialNumber: '',
    problem: ''
  });
  const [submittedId, setSubmittedId] = useState(null);

  useEffect(() => {
    fetch('/api/service')
      .then(res => res.json())
      .then(data => setRequests(data || []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmitService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setRequests([data, ...requests]);
      setSubmittedId(data.id);
      setShowForm(false);
      setFormData({ customerName: '', phone: '', productName: '', serialNumber: '', problem: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: 900 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="glass-panel" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', color: 'var(--primary-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>
            Authorised Technical Servicing
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0' }}>
            TechCore <span className="gradient-text">Service Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Book hardware repair, laptop cleaning, GPU re-pasting, or desktop diagnostics.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Request Repair Ticket
        </button>
      </div>

      {submittedId && (
        <div className="alert-box alert-success" style={{ marginBottom: '2rem' }}>
          <CheckCircle2 size={18} /> Service request registered! Your Repair Ticket ID is <strong>#{submittedId}</strong>.
        </div>
      )}

      {/* Repair Ticket Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmitService} className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>New Repair Ticket</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Product Name & Model</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. ASUS ROG Strix Laptop"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Serial Number (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="SN-..."
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Description / Fault Symptoms</label>
            <textarea
              className="form-control"
              rows="3"
              required
              placeholder="e.g. Laptop turns off randomly during video render..."
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Submit Repair Ticket
          </button>
        </form>
      )}

      {/* Service Tickets List */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Live Repair Tickets Timeline</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map(req => (
          <div key={req.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-cyan)' }}>#{req.id}</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.productName}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Customer: {req.customerName} ({req.phone}) • Fault: "{req.problem}"
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="glass-panel" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>
                {req.status}
              </span>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Assigned Tech: {req.technician}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
