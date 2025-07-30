import React, { useState, useMemo } from 'react';

const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    padding: '2.5rem 2rem',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    margin: '1rem 0',
    animation: 'fadeIn 0.5s',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2rem',
    margin: '0 0 1rem 0',
    color: '#1d3557',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  message: {
    fontSize: '1.1rem',
    margin: '1rem 0 0.5rem 0',
    color: '#343a40',
  },
  button: {
    marginTop: '1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(37,99,235,0.07)',
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const operations = [
  {
    label: '+',
    fn: (a, b) => a + b,
    format: (a, b) => `${a} + ${b}`
  },
  {
    label: '-',
    fn: (a, b) => a - b,
    format: (a, b) => `${a} - ${b}`
  },
  {
    label: 'x',
    fn: (a, b) => a * b,
    format: (a, b) => `${a} x ${b}`
  }
];

function CaptchaComponent({ onSuccess }) {
  const { question, answer } = useMemo(() => {
    const op = operations[getRandomInt(0, operations.length - 1)];
    const a = getRandomInt(1, 10);
    const b = getRandomInt(1, 10);
    return {
      question: `¿Cuánto es ${op.format(a, b)}?`,
      answer: op.fn(a, b).toString()
    };
  }, []);

  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (input.trim() === answer) {
      setError('');
      onSuccess();
    } else {
      setError('Respuesta incorrecta. Intenta de nuevo.');
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.icon} role="img" aria-label="Captcha">
        <span style={{ fontSize: '2.2rem' }}>🧩</span>
      </div>
      <div style={styles.title}>Verificación</div>
      <form onSubmit={handleSubmit}>
        <div style={styles.message}>{question}</div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          style={{
            padding: "0.5rem",
            fontSize: "1.1rem",
            borderRadius: "6px",
            border: "1px solid #bdbdbd",
            marginTop: "1rem",
            width: "80%",
            boxSizing: "border-box"
          }}
        />
        <div>
          <button style={styles.button} type="submit">Verificar</button>
        </div>
        {error && <div style={{ color: "crimson", marginTop: "1rem" }}>{error}</div>}
      </form>
    </div>
  );
}

export default CaptchaComponent;