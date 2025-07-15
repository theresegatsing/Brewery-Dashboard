import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentTime, setCurrentTime] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch breweries
  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=50');
        const data = await response.json();
        // Add mock proprietor data since API doesn't provide it
        const breweriesWithProprietor = data.map(brewery => ({
          ...brewery,
          proprietor: `Proprietor ${Math.floor(Math.random() * 100)}` // Mock data
        }));
        setBreweries(breweriesWithProprietor);
      } catch (error) {
        console.error("Error fetching breweries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();

    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sort breweries
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBreweries = [...breweries].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter breweries
  const filteredBreweries = sortedBreweries.filter(brewery => {
    const matchesSearch = 
      brewery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brewery.proprietor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || brewery.brewery_type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Reset function
  const resetDashboard = () => {
    setSearchTerm('');
    setFilterType('all');
    setSortConfig({ key: null, direction: 'asc' });
  };

  if (loading) return <div className="loading">Loading breweries...</div>;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">BrewDash</div>
        <nav className="nav">
          <span onClick={resetDashboard}>🏠 Dashboard</span>
          <span>🔍 Search</span>
          <span>ℹ️ About</span>
        </nav>
      </div>

      {/* Header */}
      <header className="header">
        <div className="location-time">
          <div>Portland, OR</div>
          <div>{currentTime}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Breweries</h3>
            <p>{breweries.length}</p>
          </div>
          <div className="stat-card">
            <h3>Micro Breweries</h3>
            <p>{breweries.filter(b => b.brewery_type === 'micro').length}</p>
          </div>
          <div className="stat-card">
            <h3>Regional Breweries</h3>
            <p>{breweries.filter(b => b.brewery_type === 'regional').length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search breweries or proprietors..."
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

        {/* Breweries Table */}
        <div className="breweries-table">
          <div className="table-header">
            <span onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </span>
            <span onClick={() => requestSort('brewery_type')}>
              Type {sortConfig.key === 'brewery_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </span>
            <span onClick={() => requestSort('proprietor')}>
              Proprietor {sortConfig.key === 'proprietor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </span>
            <span onClick={() => requestSort('city')}>
              City {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </span>
          </div>
          
          {filteredBreweries.length > 0 ? (
            filteredBreweries.map(brewery => (
              <div key={brewery.id} className="brewery-row">
                <span className="brewery-name">{brewery.name}</span>
                <span className="brewery-type">{brewery.brewery_type}</span>
                <span className="brewery-proprietor">{brewery.proprietor}</span>
                <span className="brewery-city">{brewery.city}</span>
              </div>
            ))
          ) : (
            <div className="no-results">No breweries found matching your criteria</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;