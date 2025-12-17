import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [lowStock, setLowStock] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
        // Fetch Low Stock
        try {
            const lowStockResponse = await axios.get('/api/stocks/low-stock', {
                params: {
                    threshold: 10,
                },
            });
            console.log('Low Stock Response:', lowStockResponse.data);
            setLowStock(Array.isArray(lowStockResponse.data) ? lowStockResponse.data : []);
        } catch (err) {
            console.error('Error fetching low stock:', err);
            setLowStock([]);
        }

        // Fetch Expiring Soon
        try {
            const expiringSoonResponse = await axios.get('/api/stocks/expiring-soon', {
                params: {
                    start: new Date().toISOString().split('T')[0], // 2025-05-15
                    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2025-06-14
                },
            });
            console.log('Expiring Soon Response:', expiringSoonResponse.data);
            setExpiringSoon(Array.isArray(expiringSoonResponse.data) ? expiringSoonResponse.data : []);
        } catch (err) {
            console.error('Error fetching expiring soon:', err);
            setExpiringSoon([]);
        }

       // Fetch Recent Sales
       try {
            const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2025-05-08
            const endDate = new Date().toISOString().split('T')[0]; // 2025-05-15
            const recentSalesResponse = await axios.get('/api/sales/date-range', {
                params: { start: startDate, end: endDate },
            });
            console.log('Recent Sales Response:', recentSalesResponse.data);
            setRecentSales(Array.isArray(recentSalesResponse.data) ? recentSalesResponse.data.slice(-2) : []);
        } catch (err) {
            console.error('Error fetching recent sales:', err);
            setRecentSales([]);
        }

        // Fetch Monthly Sales
        try {
            const monthlySalesResponse = await axios.get('/api/sales/monthly');
            console.log('Monthly Sales Response:', monthlySalesResponse.data);
            setMonthlySales(Array.isArray(monthlySalesResponse.data) ? monthlySalesResponse.data : []);
        } catch (err) {
            console.error('Error fetching monthly sales, calculating from recent sales:', err);
            const salesResponse = await axios.get('/api/sales');
            const sales = Array.isArray(salesResponse.data) ? salesResponse.data : [];
            const monthlyBreakdown = sales.reduce((acc, sale) => {
                const month = sale.saleDate ? sale.saleDate.split('-').slice(0, 2).join('-') : 'Unknown';
                acc[month] = (acc[month] || 0) + (sale.totalAmount || 0);
                return acc;
            }, {});
            const calculatedMonthlySales = Object.entries(monthlyBreakdown).map(([month, totalAmount]) => ({
                month,
                totalAmount,
            }));
            console.log('Calculated Monthly Sales:', calculatedMonthlySales);
            setMonthlySales(calculatedMonthlySales);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
        setError(`Failed to load dashboard data: ${errorMessage}. Check console for details.`);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    if (monthlySales.length > 0) {
      const ctx = document.getElementById('salesChart')?.getContext('2d');
      if (!ctx) {
        console.error('Chart canvas context not found');
        return;
      }
      if (chartInstance) {
        chartInstance.destroy();
      }
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthlySales.map(sale => sale.month || 'Unknown'),
          datasets: [{
            label: 'Total Sales ($)',
            data: monthlySales.map(sale => sale.totalAmount || 0),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount ($)' },
            },
            x: { title: { display: true, text: 'Month' } },
          },
        },
      });
      setChartInstance(newChartInstance);
    }
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [monthlySales]);

  return (
    <div className="space-y-8">
      <div className="text-gray-800">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="text-sm text-gray-600">Today's Sales</h3>
              <p className="text-xl font-bold text-green-700">
                  {(recentSales.reduce((sum, sale) => {
                      const saleDate = sale.saleDate?.split('T')[0];
                      const today = new Date().toISOString().split('T')[0]; // 2025-05-15
                      return saleDate === today ? sum + (sale.totalAmount || 0) : sum;
                  }, 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$ 0'}
              </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="text-sm text-gray-600">Total Sales (Month)</h3>
              <p className="text-xl font-bold text-green-700">
                  {(monthlySales.reduce((sum, sale) => {
                      const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // 2025-05
                      return sale.month === currentMonth ? sum + (sale.totalAmount || 0) : sum;
                  }, 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$ 0'}
              </p>
          </div>
              <div className="p-6 bg-red-50 rounded-lg shadow border-l-4 border-red-500">
                <h3 className="text-sm text-gray-600">Low Stock</h3>
                <p className="text-xl font-bold text-red-700">{lowStock.length}</p>
                <p className="text-red-600 text-sm">Needs attention</p>
              </div>
              <div className="p-6 bg-yellow-50 rounded-lg shadow border-l-4 border-yellow-500">
                <h3 className="text-sm text-gray-600">Expiring Soon</h3>
                <p className="text-xl font-bold text-yellow-700">{expiringSoon.length}</p>
                <p className="text-gray-600 text-sm">Within 30 days</p>
              </div>
            </div>

            <div className="flex gap-6 mt-6">
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Low Stock Products</h3>
                      <Link to="/out-of-stock" className="text-blue-600 text-sm hover:underline">
                        View All
                      </Link>
                    </div>
                    {lowStock.length === 0 ? (
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
                              <td className="p-3 text-sm">{item.productName || item.product?.name || 'Unknown'}</td>
                              <td className="p-3 text-sm">{item.quantity || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Expiring Products</h3>
                      <Link to="/expiring" className="text-blue-600 text-sm hover:underline">
                        View All
                      </Link>
                    </div>
                    {expiringSoon.length === 0 ? (
                      <p className="text-gray-600 text-sm">No products expiring soon.</p>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-gray-600">
                            <th className="p-3 text-sm">Product</th>
                            <th className="p-3 text-sm">Expiry Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expiringSoon.map((item, index) => (
                            <tr key={index} className="border-t border-gray-300">
                              <td className="p-3 text-sm">{item.productName ||'Unknown'}</td>
                              <td className="p-3 text-sm">{item.expiryDate || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                        <Link to="/transactions" className="text-blue-600 text-sm hover:underline">
                            View All
                        </Link>
                    </div>
                    {recentSales.length === 0 ? (
                        <p className="text-gray-600 text-sm">No recent transactions.</p>
                    ) : (
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
                    )}
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales</h3>
                  {monthlySales.length === 0 ? (
                    <p className="text-gray-600 text-sm">No sales data available.</p>
                  ) : (
                    <canvas id="salesChart" width="400" height="200"></canvas>
                  )}
                </div>
              </div>

              <div className="w-52 p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/products/add" className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 block text-center">Add Product</Link>
                  <Link to="/sales/add" className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 block text-center">Add Sale</Link>
                  <Link to="/stocks/add" className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 block text-center">Add Stock</Link>
                  <Link to="/suppliers/add" className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 block text-center">Add Supplier</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;