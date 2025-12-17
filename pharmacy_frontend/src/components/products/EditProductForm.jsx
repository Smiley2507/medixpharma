import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const EditProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    dosage: '',
    price: '',
    supplierId: '',
  });
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, supplierRes] = await Promise.all([
          axios.get(`/api/products/${productId}`),
          axios.get('/api/suppliers'),
        ]);
        console.log('Fetched product:', productRes.data);
        console.log('Fetched suppliers:', supplierRes.data);
        const product = productRes.data;
        setFormData({
          name: product.name || '',
          genericName: product.genericName || '',
          manufacturer: product.manufacturer || '',
          dosage: product.dosage || '',
          price: product.price?.toString() || '',
          supplierId: product.supplierId?.toString() || '',
        });
        setSuppliers(Array.isArray(supplierRes.data) ? supplierRes.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      }
    };
    fetchData();
  }, [productId]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      setError('Please enter a valid price.');
      return;
    }

    const data = {
      productId: parseInt(productId),
      name: formData.name,
      genericName: formData.genericName,
      manufacturer: formData.manufacturer,
      dosage: formData.dosage,
      price: priceValue.toFixed(2),
      supplierId: formData.supplierId ? parseInt(formData.supplierId) : null,
    };

    console.log('Sending data:', data);

    try {
      const token = localStorage.getItem('token');
      console.log('JWT Token:', token);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.put(`/api/products/${productId}`, data, config);
      console.log('Response:', res.data);
      setSuccess('Product updated successfully!');
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      console.error('Error updating product:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      const errorMessage = 'Failed to update product: ' + serverMessage;
      console.log('Detailed server error:', err.response?.data);
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
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
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Generic Name
          </label>
          <input
            type="text"
            value={formData.genericName}
            onChange={(e) => handleChange('genericName', e.target.value)}
            placeholder="Enter generic name"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Manufacturer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => handleChange('manufacturer', e.target.value)}
            placeholder="Enter manufacturer"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Dosage <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            placeholder="Enter dosage (e.g., 500mg)"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Enter price"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={formData.supplierId}
            onChange={(e) => handleChange('supplierId', e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a supplier (optional)</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;