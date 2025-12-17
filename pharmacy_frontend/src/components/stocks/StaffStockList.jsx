import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const StaffStockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get('/api/stocks');
        console.log('Fetched stocks:', res.data);
        setStocks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error';
        setError(`Failed to load stocks: ${err.response?.status || ''} ${errorMessage}. Check server logs for details.`);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock entry?')) {
      try {
        await axios.delete(`/api/stocks/${id}`);
        setStocks(stocks.filter((stock) => stock.stockId !== id));
      } catch (err) {
        console.error('Error deleting stock:', err);
        const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error';
        setError(`Failed to delete stock: ${err.response?.status || ''} ${errorMessage}. Check server logs for details.`);
      }
    }
  };

  const filteredStocks = Array.isArray(stocks)
    ? stocks.filter((stock) =>
        stock && stock.stockId && Object.values({
          stockId: stock.stockId,
          productName: stock.productName || '',
          productId: stock.productId || '',
          quantity: stock.quantity || 0,
          batchNumber: stock.batchNumber || '',
          expiryDate: stock.expiryDate || '',
        }).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  const totalItems = filteredStocks.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStocks = filteredStocks.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center p-4 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-1/3 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Batch Number</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStocks.length > 0 ? (
              paginatedStocks.map((stock, index) => (
                <tr key={stock.stockId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{stock.stockId || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{stock.productName || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{stock.quantity || '0'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{stock.batchNumber || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{stock.expiryDate || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No stocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 p-1 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffStockList;