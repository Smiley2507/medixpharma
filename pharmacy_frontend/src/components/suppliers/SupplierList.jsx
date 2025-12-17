import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('/api/suppliers');
        console.log('Fetched suppliers:', res.data);
        setSuppliers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error';
        setError(`Failed to load suppliers: ${err.response?.status || ''} ${errorMessage}. Check server logs for details.`);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`/api/suppliers/${id}`);
        setSuppliers(suppliers.filter((supplier) => supplier.supplierId !== id));
      } catch (err) {
        console.error('Error deleting supplier:', err);
        const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error';
        setError(`Failed to delete supplier: ${err.response?.status || ''} ${errorMessage}. Check server logs for details.`);
      }
    }
  };

  const filteredSuppliers = Array.isArray(suppliers)
    ? suppliers.filter((supplier) =>
        supplier && supplier.supplierId && Object.values({
          supplierId: supplier.supplierId,
          name: supplier.name || '',
          contactNumber: supplier.contactNumber || '',
          email: supplier.email || '',
        }).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

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
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-1/3 focus:ring-2 focus:ring-blue-500"
        />
        <Link
          to="/suppliers/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Supplier
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Contact Number</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.length > 0 ? (
              paginatedSuppliers.map((supplier, index) => (
                <tr key={supplier.supplierId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{supplier.supplierId || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{supplier.name || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{supplier.contactNumber || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">{supplier.email || '-'}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <Link
                        to={`/suppliers/edit/${supplier.supplierId}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(supplier.supplierId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No suppliers found.
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

export default SupplierList;