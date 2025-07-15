import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Fetch breweries data
  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=20');
        const data = await response.json();
        setBreweries(data);
      } catch (error) {
        console.error("Error fetching breweries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Statistics calculations
  const totalBreweries = breweries.length;
  const microBreweries = breweries.filter(b => b.brewery_type === 'micro').length;
  const regionalBreweries = breweries.filter(b => b.brewery_type === 'regional').length;
  
  // Filter breweries
  const filteredBreweries = breweries.filter(brewery => {
    const matchesSearch = brewery.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || brewery.brewery_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="loading">Loading breweries...</div>;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo">BrewDash</div>
        <nav className="nav">
          <span>🏠 Dashboard</span>
          <span>🔍 Search</span>
          <span>ℹ️ About</span>
        </nav>
        <div className="location-time">
          <div>Portland, OR</div>
          <div>{currentTime}</div>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Breweries</h3>
          <p>{totalBreweries}</p>
        </div>
        <div className="stat-card">
          <h3>Micro Breweries</h3>
          <p>{microBreweries}</p>
        </div>
        <div className="stat-card">
          <h3>Regional Breweries</h3>
          <p>{regionalBreweries}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search breweries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="micro">Micro</option>
          <option value="regional">Regional</option>
          <option value="brewpub">Brewpub</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Breweries List */}
      <div className="breweries-table">
        <div className="table-header">
          <span>Name</span>
          <span>Type</span>
          <span>City</span>
          <span>State</span>
        </div>
        
        {filteredBreweries.length > 0 ? (
          filteredBreweries.map(brewery => (
            <div key={brewery.id} className="brewery-row">
              <span className="brewery-name">{brewery.name}</span>
              <span className="brewery-type">{brewery.brewery_type}</span>
              <span className="brewery-city">{brewery.city}</span>
              <span className="brewery-state">{brewery.state}</span>
            </div>
          ))
        ) : (
          <div className="no-results">No breweries found matching your criteria</div>
        )}
      </div>
    </div>
  );
}

export default App;