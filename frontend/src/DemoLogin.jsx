import { useState } from 'react';
import { DEMO_ACCOUNTS } from './demoAccounts';

export default function DemoLogin({ onSelect }) {
  const [selected, setSelected] = useState(DEMO_ACCOUNTS[0].id);

  const choose = () => {
    const account = DEMO_ACCOUNTS.find((item) => item.id === selected);
    localStorage.setItem('homecooked-demo-user', JSON.stringify(account));
    onSelect?.(account);
  };

  return (
    <section className="demo-login" aria-labelledby="demo-login-title">
      <span className="eyebrow">Try the kitchen</span>
      <h2 id="demo-login-title">Choose a demo account</h2>
      <p>Explore HomeCooked with different levels of access. No password required.</p>

      <div className="demo-account-grid">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            type="button"
            key={account.id}
            className={`demo-account ${selected === account.id ? 'is-selected' : ''}`}
            onClick={() => setSelected(account.id)}
          >
            <span className="demo-avatar" aria-hidden="true">{account.avatar}</span>
            <span>
              <strong>{account.name}</strong>
              <small>{account.title}</small>
            </span>
          </button>
        ))}
      </div>

      <button type="button" className="demo-login-button" onClick={choose}>
        Enter the kitchen →
      </button>

      <small className="demo-note">Demo roles only — this is not real authentication.</small>
    </section>
  );
}
