import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

function Dashboard() {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=50');
        const data = await response.json();
        setBreweries(data);
      } catch (error) {
        console.error("Error fetching breweries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const resetDashboard = () => {
    setSearchTerm('');
    setFilterType('all');
  };

  const filteredBreweries = breweries.filter(brewery => {
    const matchesSearch = brewery.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || brewery.brewery_type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Chart data
  const breweryTypeData = ['micro', 'regional', 'large', 'brewpub'].map(type => ({
    name: type,
    value: breweries.filter(b => b.brewery_type === type).length
  }));

  const stateData = Object.entries(
    breweries.reduce((acc, b) => {
      acc[b.state] = (acc[b.state] || 0) + 1;
      return acc;
    }, {})
  ).map(([state, count]) => ({ name: state, value: count }));

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
            <p>{breweryTypeData.find(d => d.name === 'micro')?.value}</p>
          </div>
          <div className="stat-card">
            <h3>Regional Breweries</h3>
            <p>{breweryTypeData.find(d => d.name === 'regional')?.value}</p>
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

        {/* Charts */}
        <div className="charts">
          <div className="chart-card">
            <h3>Brewery Types</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={breweryTypeData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {breweryTypeData.map((_, index) => (
                  <Cell key={index} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="chart-card">
            <h3>Top States by Breweries</h3>
            <BarChart width={600} height={300} data={stateData.slice(0, 10)}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        {/* Breweries Table */}
        <div className="breweries-table">
          <div className="table-header">
            <span>Name</span>
            <span>Type</span>
            <span>City</span>
            <span>State</span>
          </div>
          
          {filteredBreweries.length > 0 ? (
            filteredBreweries.map(brewery => (
              <Link to={`/brewery/${brewery.id}`} key={brewery.id} className="brewery-row">
                <span className="brewery-name">{brewery.name}</span>
                <span className="brewery-type">{brewery.brewery_type}</span>
                <span className="brewery-city">{brewery.city}</span>
                <span className="brewery-state">{brewery.state}</span>
              </Link>
            ))
          ) : (
            <div className="no-results">No breweries found matching your criteria</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
