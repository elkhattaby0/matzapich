import { useLocation, Link } from 'react-router-dom';

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="verify-email">
      <section>
        <h1>Verify your email</h1>
        <ol>
          <li>We sent a verification link to <strong>{email || 'your email'}</strong>.</li>
          <li>Open your inbox and click the link.</li>
          <li>After verifying, come back here and <Link to="/login">log in</Link>.</li>
        </ol>
        <p>Once verified, you’ll be able to access your account.</p>
      </section>
    </div>
  );
}
