import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link } from 'react-router-dom';

const OutOfStockPage = () => {
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/stocks/low-stock', {
          params: { threshold: 10 },
        });
        console.log('Full Low Stock Response:', response.data);
        setLowStock(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching low stock:', err);
        setError('Failed to load low stock data: ' + (err.message || 'Unknown error'));
        setLowStock([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLowStock();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Low Stock Products</h2>
        <Link to="/" className="text-blue-600 text-sm hover:underline">
          Back to Dashboard
        </Link>
      </div>

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

      {lowStock.length === 0 && !loading && !error ? (
        <p className="text-gray-600 text-sm">No low stock products.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600">
              <th className="p-3 text-sm">Product</th>
              <th className="p-3 text-sm">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="p-3 text-sm">{item.productName || 'Unknown'}</td>
                <td className="p-3 text-sm">{item.quantity || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OutOfStockPage;