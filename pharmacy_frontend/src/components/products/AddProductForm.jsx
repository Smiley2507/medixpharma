import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig'; // Use the configured axios instance

const AddProductForm = () => {
  const navigate = useNavigate();
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
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('/api/suppliers');
        console.log('Fetched suppliers:', res.data);
        setSuppliers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError(`Failed to load suppliers: ${err.response?.status || ''} ${err.response?.statusText || err.message}. Check server logs for details.`);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.supplierId || formData.supplierId === '') {
      setError('Please select a supplier.');
      return;
    }

    const supplierId = parseInt(formData.supplierId);
    if (isNaN(supplierId) || supplierId <= 0) {
      setError('Invalid supplier selected.');
      return;
    }

    const requestData = {
      name: formData.name,
      genericName: formData.genericName,
      manufacturer: formData.manufacturer,
      dosage: formData.dosage,
      price: parseFloat(formData.price),
      supplierId: supplierId
    };

    console.log('Sending data:', requestData);
    try {
      const res = await axios.post('/api/products', requestData);
      console.log('Response:', res.data);
      setSuccess('Product created successfully!');
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error';
      console.log('Detailed server error:', err.response?.data);
      setError(`Failed to create product: ${err.response?.status || ''} ${errorMessage}. Check server logs for details.`);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Create Product</h2>
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
            Supplier <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.supplierId}
            onChange={(e) => handleChange('supplierId', e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a supplier</option>
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
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;