import { useState, useEffect } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Only hit the counter API once per session to avoid double-counting on hot reloads
    const hasVisited = sessionStorage.getItem('hasVisitedDatastore');
    const endpoint = hasVisited 
      ? 'https://api.counterapi.dev/v1/shahbazhaque/prompt-datastore/get'
      : 'https://api.counterapi.dev/v1/shahbazhaque/prompt-datastore/up';

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setCount(data.count);
        if (!hasVisited) {
          sessionStorage.setItem('hasVisitedDatastore', 'true');
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error || count === null) return null;

  return (
    <div className="visitor-counter fade-in">
      <span>{count.toLocaleString()}</span> visits
    </div>
  );
}
