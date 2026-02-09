import Logo from '../../components/common/Logo';
import Footer from '../../components/layout/Footer';

export default function AuthLayout({ children }) {
  return (
      <div className="AuthLayout">
        <Logo size={40} />
        {children}
        <Footer />
      </div>
  );
}
