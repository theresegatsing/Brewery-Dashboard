import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

function BreweryDetail() {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const res = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        const data = await res.json();
        setBrewery(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBrewery();
  }, [id]);

  if (!brewery) return <div className="loading">Loading brewery details...</div>;

  return (
    <div className="dashboard">
      {/* Sidebar reused from dashboard */}
      <div className="sidebar">
        <div className="logo">BrewDash</div>
        <nav className="nav">
          <a href="/">🏠 Dashboard</a>
          <span>🔍 Search</span>
          <span>ℹ️ About</span>
        </nav>
      </div>

      <main className="main-content">
        <h2>{brewery.name}</h2>
        <p><strong>Type:</strong> {brewery.brewery_type}</p>
        <p><strong>Address:</strong> {brewery.street}, {brewery.city}, {brewery.state} {brewery.postal_code}</p>
        <p><strong>Country:</strong> {brewery.country}</p>
        <p><strong>Phone:</strong> {brewery.phone || 'N/A'}</p>
        <p><strong>Website:</strong> {brewery.website_url ? (
          <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a>
        ) : 'N/A'}</p>
      </main>
    </div>
  );
}

export default BreweryDetail;
