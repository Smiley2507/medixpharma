import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const EditSupplierForm = () => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`/api/suppliers/${supplierId}`);
        console.log('Fetched supplier:', res.data);
        const supplier = res.data;
        setFormData({
          name: supplier.name || '',
          contactNumber: supplier.contactNumber || '',
          email: supplier.email || '',
        });
      } catch (err) {
        console.error('Error fetching supplier:', err);
        setError('Failed to load supplier data: ' + (err.message || 'Unknown error'));
      }
    };
    fetchSupplier();
  }, [supplierId]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError('Please enter a supplier name.');
      return;
    }

    if (!formData.contactNumber.trim()) {
      setError('Please enter a contact number.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter an email address.');
      return;
    }

    const data = {
      supplierId: parseInt(supplierId),
      name: formData.name.trim(),
      contactNumber: formData.contactNumber.trim(),
      email: formData.email.trim(),
    };

    console.log('Sending data:', data);

    try {
      const res = await axios.put(`/api/suppliers/${supplierId}`, data);
      console.log('Response:', res.data);
      setSuccess('Supplier updated successfully!');
      setTimeout(() => navigate('/suppliers'), 1000);
    } catch (err) {
      console.error('Error updating supplier:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      const errorMessage = 'Failed to update supplier: ' + serverMessage;
      console.log('Detailed server error:', err.response?.data);
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Edit Supplier</h2>
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
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter supplier name"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
            placeholder="Enter contact number"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email address"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          Update Supplier
        </button>
      </form>
    </div>
  );
};

export default EditSupplierForm;