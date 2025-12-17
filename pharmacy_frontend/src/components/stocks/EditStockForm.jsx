import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const EditStockForm = () => {
  const navigate = useNavigate();
  const { stockId } = useParams();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    batchNumber: '',
    expiryDate: '',
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockRes, productsRes] = await Promise.all([
          axios.get(`/api/stocks/${stockId}`),
          axios.get('/api/products'),
        ]);
        console.log('Fetched stock:', stockRes.data);
        console.log('Fetched products:', productsRes.data);
        const stock = stockRes.data;
        setFormData({
          productId: stock.productId?.toString() || '',
          quantity: stock.quantity?.toString() || '',
          batchNumber: stock.batchNumber || '',
          expiryDate: stock.expiryDate || '',
        });
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      }
    };
    fetchData();
  }, [stockId]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const productId = parseInt(formData.productId);
    const quantity = parseInt(formData.quantity);

    if (isNaN(productId) || productId <= 0) {
      setError('Invalid product selected.');
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    const data = {
      stockId: parseInt(stockId),
      productId: productId,
      quantity: quantity,
      batchNumber: formData.batchNumber,
      expiryDate: formData.expiryDate,
    };

    console.log('Sending data:', data);

    try {
      const res = await axios.put(`/api/stocks/${stockId}`, data);
      console.log('Response:', res.data);
      setSuccess('Stock updated successfully!');
      setTimeout(() => navigate('/stocks'), 1000);
    } catch (err) {
      console.error('Error updating stock:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      const errorMessage = 'Failed to update stock: ' + serverMessage;
      console.log('Detailed server error:', err.response?.data);
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Edit Stock</h2>
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
                {product.name} - {product.genericName} ({product.dosage})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            Expiry Date
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          Update Stock
        </button>
      </form>
    </div>
  );
};

export default EditStockForm;