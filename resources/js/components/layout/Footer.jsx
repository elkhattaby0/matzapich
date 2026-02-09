export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <span>© {year} EL KHATTABY Lahoucine</span>
      <span>matzapich · v0.1.0</span>
    </footer>
  );
}
