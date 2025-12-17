import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const AddStockForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    batchNumber: '',
    quantity: '',
    expiryDate: '',
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('Fetched products:', response.data);
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products: ' + (err.message || 'Unknown error'));
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.productId) {
      setError('Please select a product.');
      return;
    }

    const quantityValue = parseInt(formData.quantity);
    if (isNaN(quantityValue) || quantityValue < 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    if (!formData.expiryDate) {
      setError('Please select an expiry date.');
      return;
    }

    const data = {
      productId: parseInt(formData.productId),
      batchNumber: formData.batchNumber,
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate
    };

    console.log('Sending data:', data);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const res = await axios.post('/api/stocks', data, config);
      console.log('Response:', res.data);
      setSuccess('Stock added successfully!');
      setTimeout(() => navigate('/stocks'), 1000);
    } catch (err) {
      console.error('Error adding stock:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      console.log('Detailed server error:', err.response?.data);
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Add Stock</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Product <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleChange('productId', e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Batch Number
          </label>
          <input
            type="text"
            value={formData.batchNumber}
            onChange={(e) => handleChange('batchNumber', e.target.value)}
            placeholder="Enter batch number"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
};

export default AddStockForm;