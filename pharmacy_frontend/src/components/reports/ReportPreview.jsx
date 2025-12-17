const ReportPreview = ({ reportType, reportData, startDate, endDate }) => {
    if (!reportData || !Array.isArray(reportData)) return null;
  
    const getTable = () => {
      if (reportType === 'salesSummary' && !Array.isArray(reportData)) {
        return (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Metric</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200 text-gray-600">Total Sales</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-600">${reportData.totalSales}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200 text-gray-600">Number of Transactions</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{reportData.transactionCount}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200 text-gray-600">Average Sale Amount</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-600">${reportData.averageSales}</td>
              </tr>
              <tr>
                <td colSpan="2" className="py-2 px-4 border-b border-gray-200 font-semibold text-center text-gray-700">Payment Method Breakdown</td>
              </tr>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Amount</th>
              </tr>
              {reportData.paymentMethods.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.method}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">${row.amount}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="py-2 px-4 border-b border-gray-200 font-semibold text-center text-gray-700">Daily Sales Breakdown</td>
              </tr>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Amount</th>
              </tr>
              {reportData.dailyBreakdown.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.date}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">${row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else if (reportType === 'stockStatus') {
        return (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Stock ID</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Product Name</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className={`${row.isLow ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.stockId}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.productName}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.quantity}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.isLow ? 'Low Stock' : 'Sufficient'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else if (reportType === 'expiringProducts') {
        return (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Stock ID</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Product Name</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Batch Number</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.stockId}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.productName}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.batchNumber}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.quantity}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else if (reportType === 'topSellingProducts') {
        return (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Product Name</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Quantity Sold</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.productName}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">{row.quantitySold}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-600">${row.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      return null;
    };
  
    return reportData && reportData.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {reportType === 'salesSummary' ? 'Sales Summary Report' :
           reportType === 'stockStatus' ? 'Stock Status Report' :
           reportType === 'expiringProducts' ? 'Expiring Products Report' :
           'Top-Selling Products Report'} (Date Range: {startDate} to {endDate})
        </h3>
        <div className="overflow-x-auto">
          {getTable()}
        </div>
      </div>
    ) : reportData && reportData.length === 0 ? (
      <div className="text-center text-gray-500 py-4">
        No data available for the selected report type and date range.
      </div>
    ) : null;
  };
  
  export default ReportPreview;