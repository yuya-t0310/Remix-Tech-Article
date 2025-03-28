import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <div>
      <header>
        <Link to="/">Remix-Tech-Article</Link>
        <nav>
          <Link to="/">TOP</Link>
        </nav>
        <nav>
          <Link to="/write">Write</Link>
        </nav>
      </header>
    </div>
  );
}
