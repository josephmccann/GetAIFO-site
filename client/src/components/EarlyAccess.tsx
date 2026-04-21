import { useState, FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';
type ErrorCode = 'validation' | 'rate-limit' | 'connection-error' | 'generic' | null;

const REVENUE_OPTIONS = [
  { value: 'under_1m', label: 'Under $1M' },
  { value: '1m_5m', label: '$1M–$5M' },
  { value: '5m_20m', label: '$5M–$20M' },
  { value: '20m_50m', label: '$20M–$50M' },
  { value: 'over_50m', label: 'Over $50M' },
];

const ACCOUNTING_OPTIONS = [
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'xero', label: 'Xero' },
  { value: 'netsuite', label: 'NetSuite' },
  { value: 'sage', label: 'Sage' },
  { value: 'freshbooks', label: 'FreshBooks' },
  { value: 'wave', label: 'Wave' },
  { value: 'other', label: 'Other' },
];

export function EarlyAccess() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorCode, setErrorCode] = useState<ErrorCode>(null);
  const [fields, setFields] = useState({
    name: '',
    email: '',
    companySize: '',
    accountingSystem: '',
    companyWebsite: '', // honeypot
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!fields.name.trim() || fields.name.trim().length < 2) {
      setErrorCode('validation');
      setFormState('error');
      return;
    }
    if (!fields.email || !fields.email.includes('@')) {
      setErrorCode('validation');
      setFormState('error');
      return;
    }

    setFormState('submitting');
    setErrorCode(null);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          companySize: fields.companySize,
          accountingSystem: fields.accountingSystem,
          companyWebsite: fields.companyWebsite,
        }),
      });

      const json = await res.json().catch(() => ({} as { ok?: boolean }));

      if (res.ok && (json as { ok?: boolean }).ok) {
        setFormState('success');
        return;
      }
      if (res.status === 429) {
        setErrorCode('rate-limit');
      } else if (res.status === 400) {
        setErrorCode('validation');
      } else {
        setErrorCode('generic');
      }
      setFormState('error');
    } catch {
      setErrorCode('connection-error');
      setFormState('error');
    }
  };

  return (
    <section className="section" id="early-access" style={{ borderBottom: 'none' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 64,
          alignItems: 'start',
        }} className="ea-grid">
          <div className="ea-copy">
            <div className="kicker">Early Access</div>
            <h2 className="h-xl">Join the first cohort.</h2>
            <p className="lede">
              We're onboarding a small group of organizations to use AI.FO against their real financial data.
            </p>
            <p className="body" style={{ marginTop: 24 }}>
              You get full product access, direct input on what we build next, and a founding-team relationship that lasts beyond the pilot.
            </p>
            <p style={{
              fontSize: 14,
              color: 'var(--c-text-dim)',
              marginTop: 32,
              lineHeight: 1.6,
            }}>
              Questions or interest in a pilot?{' '}
              <a href="mailto:sales@getaifo.com" style={{
                color: 'var(--c-accent)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}>sales@getaifo.com</a>
              <br />
              Investor inquiries?{' '}
              <a href="mailto:investors@getaifo.com" style={{
                color: 'var(--c-accent)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}>investors@getaifo.com</a>
            </p>
          </div>

          <div>
            {formState === 'success' ? (
              <div style={{
                padding: 32,
                background: 'var(--c-surface)',
                border: '1px solid var(--c-positive-border)',
                borderLeft: '3px solid var(--c-positive)',
                borderRadius: 'var(--r-lg)',
              }}>
                <div style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--c-positive)',
                  marginBottom: 12,
                  fontWeight: 600,
                }}>You're in the queue</div>
                <div style={{
                  fontSize: 16,
                  color: 'var(--c-text)',
                  lineHeight: 1.55,
                }}>
                  Thanks for the interest. We'll be in touch shortly with next steps for the first cohort.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                padding: 32,
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}>
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={fields.companyWebsite}
                  onChange={(e) => setFields({ ...fields, companyWebsite: e.target.value })}
                  style={{ position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <FormField
                  label="Name"
                  required
                  value={fields.name}
                  onChange={(v) => setFields({ ...fields, name: v })}
                />
                <FormField
                  label="Work email"
                  type="email"
                  required
                  value={fields.email}
                  onChange={(v) => setFields({ ...fields, email: v })}
                />
                <FormSelect
                  label="What's your annual revenue?"
                  value={fields.companySize}
                  onChange={(v) => setFields({ ...fields, companySize: v })}
                  options={REVENUE_OPTIONS}
                />
                <FormSelect
                  label="Accounting system"
                  value={fields.accountingSystem}
                  onChange={(v) => setFields({ ...fields, accountingSystem: v })}
                  options={ACCOUNTING_OPTIONS}
                />

                {formState === 'error' && errorCode && (
                  <div style={{
                    padding: 12,
                    background: 'var(--c-critical-trace)',
                    border: '1px solid var(--c-critical-border)',
                    borderRadius: 'var(--r)',
                    fontSize: 13,
                    color: 'var(--c-critical)',
                  }} role="alert">
                    {errorCode === 'validation' && 'Please double-check your name and email and try again.'}
                    {errorCode === 'rate-limit' && 'Too many requests from this network. Please wait a few minutes and try again.'}
                    {errorCode === 'connection-error' && (
                      <>Connection error. Please check your network and try again, or email{' '}
                        <a href="mailto:questions@getaifo.com" style={{ color: 'inherit', textDecoration: 'underline' }}>questions@getaifo.com</a>.</>
                    )}
                    {errorCode === 'generic' && (
                      <>Something went wrong. Please try again or email{' '}
                        <a href="mailto:questions@getaifo.com" style={{ color: 'inherit', textDecoration: 'underline' }}>questions@getaifo.com</a>.</>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="btn btn-primary"
                  style={{
                    justifyContent: 'center',
                    marginTop: 8,
                    opacity: formState === 'submitting' ? 0.6 : 1,
                    cursor: formState === 'submitting' ? 'wait' : 'pointer',
                  }}
                >
                  {formState === 'submitting' ? 'Submitting…' : 'Request Early Access →'}
                </button>
              </form>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .ea-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function FormField({ label, type = 'text', value, onChange, required }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{
        fontSize: 12,
        fontFamily: 'var(--f-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--c-text-dim)',
        fontWeight: 500,
      }}>{label}{required && ' *'}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '10px 12px',
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r)',
          fontSize: 14,
          color: 'var(--c-text)',
          fontFamily: 'var(--f-sans)',
        }}
      />
    </label>
  );
}

function FormSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{
        fontSize: 12,
        fontFamily: 'var(--f-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--c-text-dim)',
        fontWeight: 500,
      }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '10px 12px',
          background: 'var(--c-canvas)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r)',
          fontSize: 14,
          color: value ? 'var(--c-text)' : 'var(--c-text-dim)',
          fontFamily: 'var(--f-sans)',
        }}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
