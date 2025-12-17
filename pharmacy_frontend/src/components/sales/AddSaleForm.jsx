import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const AddSaleForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    saleDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    saleItems: [],
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        console.log('Fetched products:', res.data);
        setProducts(Array.isArray(res.data) ? res.data : []);
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

  const handleAddItem = () => {
    if (!selectedProduct) {
      setError('Please select a product.');
      return;
    }

    const product = products.find((p) => p.productId.toString() === selectedProduct);
    if (!product) {
      setError('Selected product not found.');
      return;
    }

    const existingItem = formData.saleItems.find(
      (item) => item.productId === parseInt(selectedProduct)
    );

    if (existingItem) {
      setError('This product is already in the sale.');
      return;
    }

    const newItem = {
      productId: parseInt(selectedProduct),
      productName: product.name,
      quantity: parseInt(quantity),
      unitPrice: product.price,
      totalPrice: product.price * parseInt(quantity),
    };

    setFormData({
      ...formData,
      saleItems: [...formData.saleItems, newItem],
    });
    setSelectedProduct('');
    setQuantity(1);
    setError(null);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.saleItems.filter((_, i) => i !== index);
    setFormData({ ...formData, saleItems: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.customerName.trim()) {
      setError('Please enter a customer name.');
      return;
    }

    if (formData.saleItems.length === 0) {
      setError('Please add at least one item to the sale.');
      return;
    }

    const data = {
      customerName: formData.customerName.trim(),
      saleDate: formData.saleDate,
      paymentMethod: formData.paymentMethod,
      saleItems: formData.saleItems,
    };

    console.log('Sending data:', data);

    try {
      const res = await axios.post('/api/sales', data);
      console.log('Response:', res.data);
      setSuccess('Sale added successfully!');
      setTimeout(() => navigate('/sales'), 1000);
    } catch (err) {
      console.error('Error adding sale:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      const errorMessage = 'Failed to add sale: ' + serverMessage;
      console.log('Detailed server error:', err.response?.data);
      setError(errorMessage);
    }
  };

  const totalAmount = formData.saleItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Add New Sale</h2>
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
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="Enter customer name"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Sale Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.saleDate}
            onChange={(e) => handleChange('saleDate', e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="MOBILE">Mobile Payment</option>
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Sale Items</h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Item
              </button>
            </div>
          </div>

          {formData.saleItems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                    <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.saleItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 px-4 py-2 text-sm">{item.productName}</td>
                      <td className="border-b border-gray-200 px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="border-b border-gray-200 px-4 py-2 text-sm">${item.unitPrice.toFixed(2)}</td>
                      <td className="border-b border-gray-200 px-4 py-2 text-sm">${item.totalPrice.toFixed(2)}</td>
                      <td className="border-b border-gray-200 px-4 py-2 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total Amount:</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">${totalAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          Create Sale
        </button>
      </form>
    </div>
  );
};

export default AddSaleForm;