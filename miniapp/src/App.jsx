import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Theme Colors
const COLORS = {
  background: '#000000',
  primary: '#D4AF37', // Gold
  text: '#FFFFFF',
  secondary: '#1A1A1A'
};

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    // Load or Create local wallet (simplified for demo)
    const storedKey = localStorage.getItem('mw_private_key');
    if (storedKey) {
        const w = new ethers.Wallet(storedKey);
        setWallet(w);
        fetchBalance(w.address);
    }
  }, []);

  const createWallet = () => {
      const w = ethers.Wallet.createRandom();
      localStorage.setItem('mw_private_key', w.privateKey);
      setWallet(w);
      setBalance('0.00');
  };

  const fetchBalance = async (address) => {
      // Use public RPC or the Infura key via env (if Vite configured)
      // Simulating fetch
      setBalance('0.00');
  };

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', color: COLORS.text, fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: COLORS.primary, margin: 0 }}>MalinWallet</h1>
        <p style={{ opacity: 0.7, fontSize: '14px' }}>Mini App</p>
      </header>

      {!wallet ? (
        <div style={{ textAlign: 'center' }}>
          <p>Bienvenue ! Créez un wallet pour commencer.</p>
          <button
            onClick={createWallet}
            style={{
                backgroundColor: COLORS.primary,
                color: '#000',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
            }}
          >
            Créer un Wallet
          </button>
        </div>
      ) : (
        <div>
            <div style={{ backgroundColor: COLORS.secondary, padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>Solde Total</p>
                <h2 style={{ margin: '10px 0', fontSize: '32px' }}>{balance} ETH</h2>
                <p style={{ margin: 0, fontSize: '10px', opacity: 0.5, wordBreak: 'break-all' }}>{wallet.address}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button style={btnStyle}>Acheter</button>
                <button style={btnStyle}>Vendre</button>
                <button style={btnStyle}>Swap</button>
                <button style={btnStyle}>DApps</button>
            </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
    backgroundColor: '#333',
    color: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

export default App;
