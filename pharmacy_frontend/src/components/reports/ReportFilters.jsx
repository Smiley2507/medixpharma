import { useState } from 'react';

const ReportFilters = ({ reportType, setReportType, startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="salesSummary">Sales Summary</option>
          <option value="stockStatus">Stock Status</option>
          <option value="expiringProducts">Expiring Products</option>
          <option value="topSellingProducts">Top-Selling Products</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          max={endDate}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          min={startDate}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

export default ReportFilters;