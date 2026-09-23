import React, { useState } from 'react';
import { ShieldCheck, Search, FileText, CheckCircle2 } from 'lucide-react';

export default function Warranty() {
  const [serialInput, setSerialInput] = useState('SN-ASUS4060-88412');
  const [warrantyData, setWarrantyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [issueDesc, setIssueDesc] = useState('');

  const handleCheckWarranty = async (e) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/warranty/check?serial=${encodeURIComponent(serialInput)}`);
      if (!res.ok) throw new Error('Warranty serial not found');
      const data = await res.json();
      setWarrantyData(data);
    } catch (err) {
      console.error(err);
      setWarrantyData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimWarranty = async (e) => {
    e.preventDefault();
    if (!issueDesc) return;

    try {
      await fetch('/api/warranty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber: serialInput, issueDescription: issueDesc })
      });
      setClaimSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: 800 }}>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <ShieldCheck size={48} color="var(--primary-cyan)" style={{ marginBottom: '0.75rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          TechCore Official <span className="gradient-text">Warranty Portal</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Check component serial number warranty status or lodge an official RMA warranty claim.
        </p>

        <form onSubmit={handleCheckWarranty} style={{ display: 'flex', gap: '0.5rem', maxWidth: 460, margin: '1.5rem auto 0 auto' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Serial Number (e.g. SN-ASUS4060-88412)"
            value={serialInput}
            onChange={(e) => setSerialInput(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Search size={16} /> Verify
          </button>
        </form>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Verifying warranty status...</div>}

      {warrantyData && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{warrantyData.productName}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>S/N: {warrantyData.serialNumber}</div>
            </div>
            <span className="glass-panel" style={{ padding: '0.4rem 0.85rem', color: '#34d399', fontWeight: 800, height: 'fit-content' }}>
              {warrantyData.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Warranty Duration</div>
              <strong style={{ color: 'white' }}>{warrantyData.warrantyYears}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Purchase Date</div>
              <strong style={{ color: 'white' }}>{warrantyData.purchaseDate}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Warranty Expiry</div>
              <strong style={{ color: 'var(--primary-cyan)' }}>{warrantyData.expiryDate}</strong>
            </div>
          </div>

          {/* Submit Claim Form */}
          {claimSubmitted ? (
            <div className="alert-box alert-success">
              <CheckCircle2 size={18} /> Warranty claim filed successfully. Our RMA team will contact you within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleClaimWarranty} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>File Warranty Claim (RMA)</h4>
              <div className="form-group">
                <label className="form-label">Describe hardware malfunction or fault</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  placeholder="e.g. Display artifacts under gaming load..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                <FileText size={16} /> Submit Warranty Claim
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
