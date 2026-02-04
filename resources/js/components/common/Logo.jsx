import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo-matzapich logo-high-x-height">
      mat<span className="wordmark-z">z</span>apich
    </Link>
  );
}
