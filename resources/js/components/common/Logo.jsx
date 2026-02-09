import { Link } from 'react-router-dom';

export default function Logo({ size = 30 }) {
  return (
    <Link
      to="/"
      className="logo-matzapich logo-high-x-height"
      style={{ '--logo-size': `${size}px` }}
    >
      mat
      <span className="wordmark-z">z</span>
      apich
    </Link>
  );
}
