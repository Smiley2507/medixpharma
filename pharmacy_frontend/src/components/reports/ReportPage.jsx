import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import ReportFilters from './ReportFilters';
import ReportPreview from './ReportPreview';
import ReportPDFGenerator from './ReportPDFGenerator';

const ReportPage = () => {
  const [reportType, setReportType] = useState('salesSummary');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // 2025-05-15
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pharmacyName = "MEDIX PHARMA";
  const generatedBy = "Pharmacy Manager";
  const generatedAt = "12:34 PM CAT on Thursday, May 15, 2025"; // Updated to current time

  useEffect(() => {
    fetchReportData();
  }, [reportType, startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      if (reportType === 'salesSummary') {
        const response = await axios.get('/api/sales/date-range', {
          params: { start: startDate, end: endDate },
        });
        const sales = Array.isArray(response.data) ? response.data : [];
        console.log('Sales Summary API Response:', sales);

        const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
        const transactionCount = sales.length;
        const averageSale = transactionCount ? (totalSales / transactionCount).toFixed(2) : 0;

        const paymentMethods = sales.reduce((acc, sale) => {
          const method = sale.paymentMethod || 'Unknown';
          const amount = sale.totalAmount || 0;
          const existing = acc.find(pm => pm.method === method);
          if (existing) {
            existing.amount += amount;
          } else {
            acc.push({ method, amount });
          }
          return acc;
        }, []);

        const dailyBreakdown = sales.reduce((acc, sale) => {
          const date = sale.saleDate ? sale.saleDate.split('T')[0] : 'Unknown';
          const amount = sale.totalAmount || 0;
          const existing = acc.find(db => db.date === date);
          if (existing) {
            existing.amount += amount;
          } else {
            acc.push({ date, amount });
          }
          return acc;
        }, []);

        setReportData({
          totalSales: totalSales.toFixed(2),
          transactionCount,
          averageSale,
          paymentMethods: paymentMethods.map(pm => ({
            method: pm.method,
            amount: pm.amount.toFixed(2),
          })),
          dailyBreakdown: dailyBreakdown.map(db => ({
            date: db.date,
            amount: db.amount.toFixed(2),
          })),
        });

      } else if (reportType === 'stockStatus') {
        const response = await axios.get('/api/stocks');
        const stocks = Array.isArray(response.data) ? response.data : [];
        console.log('Stocks API Response:', stocks);

        const formattedStocks = stocks.map(stock => ({
          stockId: stock.stockId || '-',
          productName: stock.productName || '-',
          quantity: stock.quantity || 0,
          isLow: (stock.quantity || 0) < 10,
          // Removed lastUpdated since it's not in StockDTO
        }));
        setReportData(formattedStocks);

      } else if (reportType === 'expiringProducts') {
        const response = await axios.get('/api/stocks/expiring-soon', {
          params: {
            start: new Date().toISOString().split('T')[0], // 2025-05-15
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2025-06-14
          },
        });
        const stocks = Array.isArray(response.data) ? response.data : [];
        console.log('Expiring Products API Response:', stocks);

        const formattedExpiringStocks = stocks.map(stock => ({
          stockId: stock.stockId || '-',
          productName: stock.productName || '-',
          batchNumber: stock.batchNumber || '-',
          quantity: stock.quantity || 0,
          expiryDate: stock.expiryDate || '-',
        }));
        setReportData(formattedExpiringStocks);

      } else if (reportType === 'topSellingProducts') {
        const response = await axios.get('/api/sales/date-range', {
          params: { start: startDate, end: endDate },
        });
        const sales = Array.isArray(response.data) ? response.data : [];
        console.log('Top Selling Products API Response:', sales);

        const productSales = sales.reduce((acc, sale) => {
          (sale.saleItems || []).forEach(item => {
            const productId = item.productId;
            const productName = item.productName || 'Unknown';
            if (productId) {
              const existing = acc.find(ps => ps.productId === productId);
              if (existing) {
                existing.quantity += item.quantity || 0;
                existing.revenue += item.totalPrice || 0;
              } else {
                acc.push({ productId, productName, quantity: item.quantity || 0, revenue: item.totalPrice || 0 });
              }
            }
          });
          return acc;
        }, []);

        const topProducts = productSales
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5)
          .map(product => ({
            productName: product.productName,
            quantitySold: product.quantity,
            totalRevenue: product.revenue.toFixed(2),
          }));
        setReportData(topProducts);
      }
    } catch (err) {
      console.error(`Error fetching ${reportType} report data:`, err);
      setError(`Failed to load ${reportType} report data: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pharmacy Reports - {pharmacyName}</h2>

      <ReportFilters
        reportType={reportType}
        setReportType={setReportType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {loading && (
        <div className="flex justify-center items-center mb-6">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Generating report...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <ReportPreview reportType={reportType} reportData={reportData} startDate={startDate} endDate={endDate} />

      <ReportPDFGenerator
        reportType={reportType}
        reportData={reportData}
        startDate={startDate}
        endDate={endDate}
        pharmacyName={pharmacyName}
        generatedBy={generatedBy}
        generatedAt={generatedAt}
      />
    </div>
  );
};

export default ReportPage;