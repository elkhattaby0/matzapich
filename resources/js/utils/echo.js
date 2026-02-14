import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

const runtimeHost =
  (typeof window !== 'undefined' && window.location?.hostname) || '127.0.0.1';
const envHost = import.meta.env.VITE_REVERB_HOST;
const host =
  envHost && !envHost.includes('${') && envHost !== 'localhost'
    ? envHost
    : runtimeHost;
const port = Number(import.meta.env.VITE_REVERB_PORT) || 8080;
const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: host,
  wsPort: port,
  wssPort: port,
  forceTLS: scheme === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      Accept: 'application/json',
    },
  },
});

// expose for debugging
if (typeof window !== 'undefined') {
  window.echo = echo;
  // Ensure a connection attempt even before subscribing to channels.
  if (echo.connector?.pusher?.connect) {
    setTimeout(() => echo.connector.pusher.connect(), 0);
  }
}

export default echo;
