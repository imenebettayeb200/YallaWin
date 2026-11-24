import { useEffect } from "react";
import { Link } from "react-router-dom";

/* NotFound — shown for any address that is not a page of the website. */
function NotFound() {
  useEffect(() => {
    document.title = "Page not found · YallaWin";
  }, []);

  return (
    <div className="fatal-state">
      <h1>Page not found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/" className="btn btn-white">
        Go home
      </Link>
    </div>
  );
}

export default NotFound;
