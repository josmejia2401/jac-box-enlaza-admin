import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRedirect, getRulesByCode } from './api';
import simpleUAParser from './ua';
import CaptchaComponent from './captcha';

// Estilos en línea
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #f7faff 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    padding: '2rem',
  },
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
  icon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
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
  },
  sub: {
    fontSize: '0.96rem',
    color: '#6c757d',
    marginTop: '1.5rem',
  }
};

function getCurrentHour() {
  const date = new Date();
  return String(date.getHours()).padStart(2, '0');
}

const ALLOWED_CONDITION_TYPES = [
  'country', 'city', 'device', 'browser', 'os', 'hour'
];

const RedirectPage = () => {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showLanding, setShowLanding] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [os, setOs] = useState('');
  const [browser, setBrowser] = useState('');
  const [device, setDevice] = useState('');
  const hour = getCurrentHour();

  // Nuevo: control para saber que venimos de un captcha exitoso
  const [captchaPassed, setCaptchaPassed] = useState(false);

  // Parse user-agent info
  useEffect(() => {
    const { device: d, os: o, browser: b } = simpleUAParser(window.navigator.userAgent);
    setDevice(d);
    setOs(o);
    setBrowser(b);
  }, []);

  // Obtener país y ciudad del usuario
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setCountry(data.country || '');
        setCity(data.city || '');
      })
      .catch(() => {
        setCountry('');
        setCity('');
      });
  }, []);

  useEffect(() => {
    // Si venimos del captcha, sólo hacemos el redirect normal
    if (captchaPassed) {
      (async () => {
        setLoading(true);
        try {
          const redirectResult = await getRedirect(code);
          window.location.href = redirectResult.data.destination;
        } catch (err) {
          setError(err.message || 'Error al redirigir');
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    // Si no venimos del captcha, sigue el flujo normal de reglas
    const doRedirect = async () => {
      setLoading(true);
      try {
        const rulesResult = await getRulesByCode(code);
        let rulesArray = Array.isArray(rulesResult)
          ? rulesResult
          : (rulesResult?.rules || rulesResult?.data || []);

        // --- FILTRAR SOLO LOS CONDITION TYPE PERMITIDOS ---
        rulesArray = rulesArray.filter(
          r => ALLOWED_CONDITION_TYPES.includes(
            (r.conditionType || '').toLowerCase()
          )
        );

        // --- ORDENAR POR PRIORIDAD (menor primero, mayor prioridad) ---
        rulesArray.sort((a, b) => {
          const pa = typeof a.priority === 'number' ? a.priority : 9999;
          const pb = typeof b.priority === 'number' ? b.priority : 9999;
          return pa - pb;
        });

        let actionTaken = false;

        for (const rule of rulesArray) {
          const cType = (rule.conditionType || '').toLowerCase();
          const cValue = (rule.conditionValue || '').trim();
          const actionType = (rule.actionType || '').toLowerCase();
          const actionValue = rule.actionValue;

          // --- Matching logic for each conditionType ---
          let matches = false;
          if (cType === 'country' && cValue && country && cValue.toUpperCase() === country.trim().toUpperCase()) matches = true;
          else if (cType === 'city' && cValue && city && cValue.toLowerCase() === city.trim().toLowerCase()) matches = true;
          else if (cType === 'device' && cValue && device && cValue.toLowerCase() === device.trim().toLowerCase()) matches = true;
          else if (cType === 'browser' && cValue && browser && cValue.toLowerCase() === browser.trim().toLowerCase()) matches = true;
          else if (cType === 'os' && cValue && os && cValue.toLowerCase() === os.trim().toLowerCase()) matches = true;
          else if (cType === 'hour' && cValue && hour && cValue.padStart(2, '0') === hour) matches = true;

          if (!matches) continue;

          // --- Handle actionType ---
          if (actionType === 'block') {
            setError('Acceso bloqueado por las reglas de acceso.');
            actionTaken = true;
            break;
          }
          if (actionType === 'redirect') {
            if (actionValue) {
              window.location.href = actionValue;
              actionTaken = true;
            }
            break;
          }
          if (actionType === 'captcha') {
            setShowCaptcha(true);
            setPendingRedirect(actionValue); // no se usa, puedes dejarlo si tienes captchas especiales
            actionTaken = true;
            break;
          }
          if (actionType === 'message') {
            setMessage(actionValue || "Mensaje personalizado para tu acceso.");
            actionTaken = true;
            break;
          }
          if (actionType === 'landing_page') {
            setShowLanding(actionValue || "<div><b>Landing personalizada</b></div>");
            actionTaken = true;
            break;
          }
        }

        if (!actionTaken) {
          // Si ninguna regla aplica, redirige normalmente
          const redirectResult = await getRedirect(code);
          window.location.href = redirectResult.data.destination;
        }
      } catch (err) {
        setError(err.message || 'Error al redirigir');
      } finally {
        setLoading(false);
      }
    };

    if (country && device && os && browser) {
      doRedirect(code);
    }
    // eslint-disable-next-line
  }, [code, country, city, device, os, browser, hour, captchaPassed]);

  // --- Render visual mejorado ---
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon} role="img" aria-label="Redirigiendo">
            <span style={{ fontSize: '2.2rem' }}>🔄</span>
          </div>
          <div style={styles.title}>Redirigiendo...</div>
          <div style={styles.message}>Por favor espera un momento.</div>
          <div style={styles.sub}>No cierres esta pestaña.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon} role="img" aria-label="Bloqueado">
            <span style={{ fontSize: '2.2rem' }}>⛔</span>
          </div>
          <div style={styles.title}>Acceso bloqueado</div>
          <div style={styles.message}>{error}</div>
          <div style={styles.sub}>Si crees que esto es un error, contacta al administrador.</div>
        </div>
      </div>
    );
  }

  if (showCaptcha) {
    return (
      <div style={styles.container}>
        <CaptchaComponent onSuccess={async () => {
          setShowCaptcha(false);
          setCaptchaPassed(true);
        }} />
      </div>
    );
  }

  if (message) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon} role="img" aria-label="Mensaje">
            <span style={{ fontSize: '2.2rem' }}>💬</span>
          </div>
          <div style={styles.title}>Mensaje</div>
          <div style={styles.message}>{message}</div>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: showLanding }}
        style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}
      />
    );
  }

  return null;
};

export default RedirectPage;