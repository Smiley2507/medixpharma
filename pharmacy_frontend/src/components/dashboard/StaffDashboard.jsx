import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { isStaff } from '../utils/auth';
import 'remixicon/fonts/remixicon.css';

const StaffDashboard = () => {
  const [recentSales, setRecentSales] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState({
    totalSalesToday: 0,
    transactionsToday: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authorization on mount and whenever dependencies change
    const checkAuthorization = () => {
      const authorized = isStaff();
      console.log('StaffDashboard - isAuthorized:', authorized);
      setIsAuthorized(authorized);
    };

    checkAuthorization();

    if (isStaff()) {
      fetchRecentSales();
      fetchStockItems();
      fetchKpis();
    }
  }, []);

  const fetchRecentSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      const response = await axios.get('/api/sales/date-range', {
        params: { start: startDate, end: endDate },
      });
      console.log('Recent Sales Response:', response.data);
      setRecentSales(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching recent sales:', err);
      setError('Failed to load recent sales: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchStockItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/stocks');
      console.log('Stock Items Response:', response.data);
      setStockItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching stock items:', err);
      setError('Failed to load stock items: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchKpis = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const salesResponse = await axios.get('/api/sales/date-range', {
        params: { start: today, end: today },
      });
      const todaySales = Array.isArray(salesResponse.data) ? salesResponse.data : [];
      const totalSalesToday = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const transactionsToday = todaySales.length;

      const lowStockResponse = await axios.get('/api/stocks/low-stock', {
        params: { threshold: 10 },
      });
      const lowStockCount = Array.isArray(lowStockResponse.data) ? lowStockResponse.data.length : 0;

      const expiringSoonResponse = await axios.get('/api/stocks/expiring-soon', {
        params: {
          start: today,
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      });
      const expiringSoonCount = Array.isArray(expiringSoonResponse.data) ? expiringSoonResponse.data.length : 0;

      setKpis({
        totalSalesToday: totalSalesToday.toFixed(2),
        transactionsToday,
        lowStockCount,
        expiringSoonCount,
      });
    } catch (err) {
      console.error('Error fetching KPIs:', err);
      setError('Failed to load KPIs: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const filteredStockItems = stockItems.filter(item =>
    item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) {
    return <div className="p-6 text-red-600">Access denied. You are not authorized as staff.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {loading && (
          <div className="flex justify-center items-center mb-6">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {/* Total Sales Today */}
  <div className="bg-white shadow-lg rounded-lg p-4 flex items-center">
    <div className="p-3 bg-blue-100 rounded-full mr-4">
      <i className="ri-money-dollar-circle-line text-blue-600 text-xl"></i>
    </div>
    <div>
      <p className="text-sm text-gray-500">Total Sales Today</p>
      <p className="text-lg font-semibold">
        {kpis.totalSalesToday.toLocaleString('en-US', { style: 'currency', currency: 'RWF' })}
      </p>
    </div>
  </div>

  {/* Transactions Today */}
  <div className="bg-white shadow-lg rounded-lg p-4 flex items-center">
    <div className="p-3 bg-green-100 rounded-full mr-4">
      <i className="ri-exchange-line text-green-600 text-xl"></i>
    </div>
    <div>
      <p className="text-sm text-gray-500">Transactions Today</p>
      <p className="text-lg font-semibold">{kpis.transactionsToday}</p>
    </div>
  </div>

  {/* Low Stock Items */}
  <div className="bg-white shadow-lg rounded-lg p-4 flex items-center">
    <div className="p-3 bg-yellow-100 rounded-full mr-4">
      <i className="ri-alert-line text-yellow-600 text-xl"></i>
    </div>
    <div>
      <p className="text-sm text-gray-500">Low Stock Items</p>
      <p className="text-lg font-semibold">{kpis.lowStockCount}</p>
    </div>
  </div>

  {/* Expiring Soon Items */}
  <div className="bg-white shadow-lg rounded-lg p-4 flex items-center">
    <div className="p-3 bg-red-100 rounded-full mr-4">
      <i className="ri-time-line text-red-600 text-xl"></i>
    </div>
    <div>
      <p className="text-sm text-gray-500">Expiring Soon Items</p>
      <p className="text-lg font-semibold">{kpis.expiringSoonCount}</p>
    </div>
  </div>
</div>

        <div className="flex mb-6 gap-4">
          <button
            onClick={() => navigate('/sales-add')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add New Sale
          </button>
          <button
            onClick={() => navigate('/staff-stocks')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            View Stock
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600">
                <th className="p-3 text-sm">ID</th>
                <th className="p-3 text-sm">Customer</th>
                <th className="p-3 text-sm">Amount</th>
                <th className="p-3 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale, index) => (
                <tr key={index} className="border-t border-gray-300">
                  <td className="p-3 text-sm">{`#INV-${sale.saleId || index + 1}`}</td>
                  <td className="p-3 text-sm">{sale.customerName || 'Unknown'}</td>
                  <td className="p-3 text-sm">
                    {(sale.totalAmount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="p-3 text-sm">
                    <span className="bg-green-100 text-green-700 px-1 py-0.5 text-xs rounded">
                      {sale.paymentMethod ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentSales.length === 0 && !loading && !error && (
            <p className="text-gray-600 text-sm mt-2">No recent transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;