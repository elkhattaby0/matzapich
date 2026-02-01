export default function Footer() {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 16px',
        height: '50px',
        color: '#111827',
        gap: '16px',
        fontSize: '13px',
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.08)',
      }}
    >
      <span>Version 0.1.0</span>
      <span>•</span>
      <span>By EL KHATTABY Lahoucine</span>
      <span>•</span>
      <span>Still in development</span>
    </footer>
  );
}
