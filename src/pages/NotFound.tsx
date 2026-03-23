import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/notFound.scss';
import notFoundGif from "../assets/giphy.gif";

export default function NotFound() {
  const pageTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pageTopRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, []);

  return (
    <div className="not-found" ref={pageTopRef}>
      <h1>404</h1>
      <p>Page not found</p>
            <img src={notFoundGif} alt="Not found" className="not-found-gif" />
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}