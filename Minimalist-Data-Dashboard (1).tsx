// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
interface SheetData {
sales: number[];
customers: number[];
avgOrder: number;
conversion: number;
recentActivity: Array<{
type: string;
title: string;
description: string;
time: string;
}>;
topProducts: Array<{
name: string;
category: string;
revenue: number;
}>;
transactions: Array<{
id: string;
customer: {
name: string;
email: string;
initials: string;
};
date: string;
amount: number;
status: string;
}>;
}
const App: React.FC = () => {
const [lastUpdated, setLastUpdated] = useState<string>('');
const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
const [sheetId, setSheetId] = useState<string>('');
const [range, setRange] = useState<string>('A1:D100');
interface ProductivityData {
department: string;
noApds: number;
hr: number;
productivityDept: number;
category?: string;
}
const [productivityData, setProductivityData] = useState<ProductivityData[]>([
{ department: 'oGX', noApds: 18, hr: 15, productivityDept: 1.2, category: 'OPS' },
{ department: 'iGV', noApds: 4, hr: 10, productivityDept: 0.4, category: 'OPS' },
{ department: 'iGTa', noApds: 3, hr: 8, productivityDept: 0.214285714, category: 'OPS' },
{ department: 'iGTe', noApds: 3, hr: 6, productivityDept: 0.214285714, category: 'OPS' },
{ department: 'BD', noApds: 1, hr: 9, productivityDept: 0.111111111, category: 'EwA' },
{ department: 'MKT', noApds: 0, hr: 7, productivityDept: 0, category: 'EwA' },
{ department: 'PM', noApds: 0, hr: 1, productivityDept: 0, category: 'Health' },
{ department: 'FnL', noApds: 0, hr: 1, productivityDept: 0, category: 'Health' },
{ department: 'Entity Head', noApds: 0, hr: 1, productivityDept: 0, category: 'Entity Head' }
]);
// Google Sheets configuration
const SHEET_ID = '1mp5q0tgB6VftPA_7khQ2juOARow--DGLacZM2UjtQnI'; // Replace with your Sheet ID
const API_KEY = 'AIzaSyD08R0l4T_3v55dEWtA8cD9Dc4Hj2-GARg'; // Replace with your API Key
const RANGE = 'A1:E15'; // Adjust based on your data range
const fetchSheetData = async () => {
try {
setSyncStatus('syncing');
const response = await fetch(
`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
);
if (!response.ok) {
throw new Error('Failed to fetch data');
}
const data = await response.json();
const rows = data.values.slice(1); // Skip header row
const processedData: ProductivityData[] = rows.map((row: any[]) => ({
department: row[0],
noApds: parseInt(row[1]) || 0,
hr: parseInt(row[2]) || 0,
productivityDept: parseFloat(row[3]) || 0,
category: getCategoryForDepartment(row[0])
}));
setProductivityData(processedData);
setSyncStatus('synced');
setLastUpdated(new Date().toLocaleTimeString());
} catch (error) {
console.error('Error fetching sheet data:', error);
setSyncStatus('error');
}
};
const getCategoryForDepartment = (department: string): string => {
const categories = {
'oGX': 'OPS',
'iGV': 'OPS',
'iGTa': 'OPS',
'iGTe': 'OPS',
'BD': 'EwA',
'MKT': 'EwA',
'PM': 'Health',
'FnL': 'Health',
'Entity Head': 'Entity Head'
};
return categories[department as keyof typeof categories] || '';
};
useEffect(() => {
fetchSheetData(); // Initial fetch
const interval = setInterval(fetchSheetData, 300000); // Refresh every 5 minutes
return () => clearInterval(interval);
}, []);
// Add this function to calculate total productivity
const calculateTotalProductivity = () => {
const totalNoApds = productivityData.reduce((sum, item) => sum + item.noApds, 0);
const totalHr = productivityData.reduce((sum, item) => sum + item.hr, 0);
return totalHr > 0 ? (totalNoApds / totalHr).toFixed(12) : '0';
};
useEffect(() => {
// Set initial last updated time
const now = new Date();
setLastUpdated(now.toLocaleTimeString());
// Update the time every minute
const interval = setInterval(() => {
const now = new Date();
setLastUpdated(now.toLocaleTimeString());
// Simulate sync status changes
const statuses: Array<'synced' | 'syncing' | 'error'> = ['synced', 'syncing', 'synced'];
const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
setSyncStatus(randomStatus);
}, 60000);
return () => clearInterval(interval);
}, []);
useEffect(() => {
// Initialize charts
const salesChart = document.getElementById('sales-chart');
const conversionChart = document.getElementById('conversion-chart');
const trafficChart = document.getElementById('traffic-chart');
if (salesChart) {
const chart = echarts.init(salesChart);
const option = {
animation: false,
grid: {
left: '3%',
right: '4%',
bottom: '3%',
top: '10%',
containLabel: true
},
xAxis: {
type: 'category',
data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
axisLine: {
lineStyle: {
color: '#E3E8EF'
}
},
axisLabel: {
color: '#94A3B8'
}
},
yAxis: {
type: 'value',
axisLine: {
show: false
},
axisLabel: {
color: '#94A3B8'
},
splitLine: {
lineStyle: {
color: '#E3E8EF'
}
}
},
series: [
{
data: [820, 932, 901, 934, 1290, 1330, 1320],
type: 'line',
smooth: true,
lineStyle: {
width: 2,
color: '#7C3AED'
},
areaStyle: {
color: {
type: 'linear',
x: 0,
y: 0,
x2: 0,
y2: 1,
colorStops: [
{
offset: 0,
color: 'rgba(124, 58, 237, 0.2)'
},
{
offset: 1,
color: 'rgba(124, 58, 237, 0)'
}
]
}
},
symbol: 'circle',
symbolSize: 6,
itemStyle: {
color: '#7C3AED'
}
}
],
tooltip: {
trigger: 'axis'
}
};
chart.setOption(option);
window.addEventListener('resize', () => {
chart.resize();
});
}
if (conversionChart) {
const chart = echarts.init(conversionChart);
const option = {
animation: false,
tooltip: {
trigger: 'item'
},
color: ['#10B981', '#3B82F6', '#F97316', '#EF4444'],
series: [
{
name: 'Conversion',
type: 'pie',
radius: ['50%', '70%'],
avoidLabelOverlap: false,
itemStyle: {
borderRadius: 6,
borderColor: '#fff',
borderWidth: 2
},
label: {
show: false
},
emphasis: {
label: {
show: true,
fontSize: '14',
fontWeight: 'bold'
}
},
labelLine: {
show: false
},
data: [
{ value: 1048, name: 'Direct' },
{ value: 735, name: 'Organic' },
{ value: 580, name: 'Email' },
{ value: 484, name: 'Social' }
]
}
]
};
chart.setOption(option);
window.addEventListener('resize', () => {
chart.resize();
});
}
if (trafficChart) {
const chart = echarts.init(trafficChart);
const option = {
animation: false,
grid: {
left: '3%',
right: '4%',
bottom: '3%',
top: '10%',
containLabel: true
},
xAxis: {
type: 'category',
data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
axisLine: {
lineStyle: {
color: '#E3E8EF'
}
},
axisLabel: {
color: '#94A3B8'
}
},
yAxis: {
type: 'value',
axisLine: {
show: false
},
axisLabel: {
color: '#94A3B8'
},
splitLine: {
lineStyle: {
color: '#E3E8EF'
}
}
},
series: [
{
data: [120, 200, 150, 80, 70, 110],
type: 'bar',
barWidth: '60%',
itemStyle: {
color: '#38BDF8',
borderRadius: [4, 4, 0, 0]
}
}
],
tooltip: {
trigger: 'axis'
}
};
chart.setOption(option);
window.addEventListener('resize', () => {
chart.resize();
});
}
}, []);
const getSyncStatusIcon = () => {
switch (syncStatus) {
case 'synced':
return <i className="fas fa-check-circle text-green-500"></i>;
case 'syncing':
return <i className="fas fa-sync-alt fa-spin text-blue-500"></i>;
case 'error':
return <i className="fas fa-exclamation-circle text-red-500"></i>;
default:
return <i className="fas fa-check-circle text-green-500"></i>;
}
};
const getSyncStatusText = () => {
switch (syncStatus) {
case 'synced':
return 'Data synced';
case 'syncing':
return 'Syncing...';
case 'error':
return 'Sync error';
default:
return 'Data synced';
}
};
return (
<div className="min-h-screen bg-gray-50 font-sans text-gray-800">
{/* Header */}
<header className="bg-white shadow-sm py-4 px-6">
<div className="max-w-7xl mx-auto">
<div className="flex justify-between items-center mb-4">
<h1 className="text-2xl font-bold text-gray-800">Google Sheets Dashboard</h1>
<div className="flex items-center space-x-4">
<div className="flex items-center text-sm text-gray-500">
<span className="mr-2">{getSyncStatusIcon()}</span>
<span>{getSyncStatusText()}</span>
</div>
<div className="text-sm text-gray-400">
Last updated: {lastUpdated}
</div>
</div>
</div>
<div className="bg-blue-50 rounded-lg p-4 mt-2">
<div className="flex items-center justify-between">
<div className="flex-1 mr-4">
<label className="block text-sm font-medium text-gray-700 mb-1">Google Sheet URL</label>
<input 
type="text" 
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
placeholder="Paste your Google Sheet URL here"
onChange={(e) => {
const url = e.target.value;
const match = url.match(/\/d\/(.*?)\/|$|\/edit/);
if (match && match[1]) {
setSheetId(match[1]);
}
}}
/>
</div>
<div className="flex-1 mr-4">
<label className="block text-sm font-medium text-gray-700 mb-1">Sheet Range</label>
<input 
type="text" 
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
placeholder="e.g., A1:D100"
value={RANGE}
onChange={(e) => setRange(e.target.value)}
/>
</div>
<div className="flex items-end">
<button 
onClick={fetchSheetData}
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap"
>
<i className="fas fa-sync-alt mr-2"></i>
Connect & Sync
</button>
</div>
</div>
</div>
</div>
</header>
{/* Dashboard Grid */}
<main className="max-w-7xl mx-auto p-6">
<div className="grid grid-cols-12 gap-6">
{/* KPI Summary - 2x1 */}
<div className="col-span-12 md:col-span-8 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(227, 242, 253, 0.3)' }}>
<h2 className="text-lg font-semibold mb-4">Key Performance Indicators</h2>
<div className="grid grid-cols-4 gap-4">
<div className="text-center">
<p className="text-sm text-gray-500 mb-1">Total Revenue</p>
<p className="text-3xl font-bold text-gray-800">$24,582</p>
<p className="text-xs text-green-500 flex items-center justify-center mt-1">
<i className="fas fa-arrow-up mr-1"></i> 12.5%
</p>
</div>
<div className="text-center">
<p className="text-sm text-gray-500 mb-1">Customers</p>
<p className="text-3xl font-bold text-gray-800">1,482</p>
<p className="text-xs text-green-500 flex items-center justify-center mt-1">
<i className="fas fa-arrow-up mr-1"></i> 8.2%
</p>
</div>
<div className="text-center">
<p className="text-sm text-gray-500 mb-1">Avg. Order</p>
<p className="text-3xl font-bold text-gray-800">$165</p>
<p className="text-xs text-green-500 flex items-center justify-center mt-1">
<i className="fas fa-arrow-up mr-1"></i> 3.1%
</p>
</div>
<div className="text-center">
<p className="text-sm text-gray-500 mb-1">Conversion</p>
<p className="text-3xl font-bold text-gray-800">4.8%</p>
<p className="text-xs text-red-500 flex items-center justify-center mt-1">
<i className="fas fa-arrow-down mr-1"></i> 1.2%
</p>
</div>
</div>
</div>
{/* Activity - 1x1 */}
<div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(232, 245, 233, 0.3)' }}>
<h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
<div className="space-y-4">
<div className="flex items-start">
<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
<i className="fas fa-file-alt text-blue-500 text-sm"></i>
</div>
<div>
<p className="text-sm font-medium">Spreadsheet Updated</p>
<p className="text-xs text-gray-500">Sales data refreshed</p>
<p className="text-xs text-gray-400">10 minutes ago</p>
</div>
</div>
<div className="flex items-start">
<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
<i className="fas fa-chart-line text-green-500 text-sm"></i>
</div>
<div>
<p className="text-sm font-medium">New Milestone Reached</p>
<p className="text-xs text-gray-500">1000+ monthly customers</p>
<p className="text-xs text-gray-400">2 hours ago</p>
</div>
</div>
<div className="flex items-start">
<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
<i className="fas fa-bell text-purple-500 text-sm"></i>
</div>
<div>
<p className="text-sm font-medium">Alert Triggered</p>
<p className="text-xs text-gray-500">Traffic spike detected</p>
<p className="text-xs text-gray-400">Yesterday</p>
</div>
</div>
</div>
</div>
{/* Sales Trend - 2x1 */}
<div className="col-span-12 md:col-span-8 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(243, 229, 245, 0.3)' }}>
<div className="flex justify-between items-center mb-4">
<h2 className="text-lg font-semibold">Sales Trend</h2>
<div className="flex space-x-2">
<button className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-full !rounded-button whitespace-nowrap">Weekly</button>
<button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full !rounded-button whitespace-nowrap">Monthly</button>
<button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full !rounded-button whitespace-nowrap">Yearly</button>
</div>
</div>
<div id="sales-chart" className="w-full h-64"></div>
</div>
{/* Conversion Rate - 1x1 */}
<div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(227, 242, 253, 0.3)' }}>
<h2 className="text-lg font-semibold mb-4">Conversion Rate</h2>
<div id="conversion-chart" className="w-full h-64"></div>
</div>
{/* Traffic Sources - 1x1 */}
<div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(232, 245, 233, 0.3)' }}>
<h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
<div id="traffic-chart" className="w-full h-64"></div>
</div>
{/* Top Products - 1x1 */}
<div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(243, 229, 245, 0.3)' }}>
<h2 className="text-lg font-semibold mb-4">Top Products</h2>
<div className="space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center">
<div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center mr-3">
<i className="fas fa-tshirt text-blue-500"></i>
</div>
<div>
<p className="text-sm font-medium">Premium T-Shirt</p>
<p className="text-xs text-gray-500">Apparel</p>
</div>
</div>
<p className="text-sm font-semibold">$12,480</p>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center mr-3">
<i className="fas fa-mug-hot text-green-500"></i>
</div>
<div>
<p className="text-sm font-medium">Ceramic Mug</p>
<p className="text-xs text-gray-500">Accessories</p>
</div>
</div>
<p className="text-sm font-semibold">$8,230</p>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center mr-3">
<i className="fas fa-headphones text-purple-500"></i>
</div>
<div>
<p className="text-sm font-medium">Wireless Headphones</p>
<p className="text-xs text-gray-500">Electronics</p>
</div>
</div>
<p className="text-sm font-semibold">$6,158</p>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<div className="w-10 h-10 rounded bg-yellow-100 flex items-center justify-center mr-3">
<i className="fas fa-book text-yellow-500"></i>
</div>
<div>
<p className="text-sm font-medium">Notebook Set</p>
<p className="text-xs text-gray-500">Stationery</p>
</div>
</div>
<p className="text-sm font-semibold">$4,925</p>
</div>
</div>
</div>
{/* Geographic Data - 1x1 */}
<div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(227, 242, 253, 0.3)' }}>
<h2 className="text-lg font-semibold mb-4">Geographic Data</h2>
<div className="space-y-3">
<div className="flex items-center justify-between">
<p className="text-sm">United States</p>
<div className="flex items-center">
<p className="text-sm font-medium mr-2">65%</p>
<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
</div>
</div>
</div>
<div className="flex items-center justify-between">
<p className="text-sm">United Kingdom</p>
<div className="flex items-center">
<p className="text-sm font-medium mr-2">15%</p>
<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-green-500 rounded-full" style={{ width: '15%' }}></div>
</div>
</div>
</div>
<div className="flex items-center justify-between">
<p className="text-sm">Canada</p>
<div className="flex items-center">
<p className="text-sm font-medium mr-2">10%</p>
<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-purple-500 rounded-full" style={{ width: '10%' }}></div>
</div>
</div>
</div>
<div className="flex items-center justify-between">
<p className="text-sm">Australia</p>
<div className="flex items-center">
<p className="text-sm font-medium mr-2">5%</p>
<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-yellow-500 rounded-full" style={{ width: '5%' }}></div>
</div>
</div>
</div>
<div className="flex items-center justify-between">
<p className="text-sm">Others</p>
<div className="flex items-center">
<p className="text-sm font-medium mr-2">5%</p>
<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-gray-500 rounded-full" style={{ width: '5%' }}></div>
</div>
</div>
</div>
</div>
</div>
{/* Data Table - 2x1 */}
<div className="col-span-12 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer">
<div className="flex justify-between items-center mb-4">
<h2 className="text-lg font-semibold">Recent Transactions</h2>
<button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg !rounded-button whitespace-nowrap">
<i className="fas fa-download mr-2"></i>Export
</button>
</div>
<div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
<tr>
<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Transaction ID
</th>
<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Customer
</th>
<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Date
</th>
<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Amount
</th>
<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Status
</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
<tr>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#TRX-5289</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
<div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
<span className="text-blue-600 font-medium">JD</span>
</div>
<div className="ml-3">
<p className="text-sm font-medium text-gray-900">John Doe</p>
<p className="text-sm text-gray-500">john@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 22, 2025</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$125.00</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
Completed
</span>
</td>
</tr>
<tr>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#TRX-5288</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
<div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
<span className="text-purple-600 font-medium">AS</span>
</div>
<div className="ml-3">
<p className="text-sm font-medium text-gray-900">Alice Smith</p>
<p className="text-sm text-gray-500">alice@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 21, 2025</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$85.50</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
Completed
</span>
</td>
</tr>
<tr>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#TRX-5287</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
<div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
<span className="text-green-600 font-medium">RJ</span>
</div>
<div className="ml-3">
<p className="text-sm font-medium text-gray-900">Robert Johnson</p>
<p className="text-sm text-gray-500">robert@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 20, 2025</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$210.75</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
Pending
</span>
</td>
</tr>
<tr>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#TRX-5286</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
<div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
<span className="text-red-600 font-medium">EW</span>
</div>
<div className="ml-3">
<p className="text-sm font-medium text-gray-900">Emma Wilson</p>
<p className="text-sm text-gray-500">emma@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 19, 2025</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$45.25</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
Completed
</span>
</td>
</tr>
<tr>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#TRX-5285</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
<div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
<span className="text-yellow-600 font-medium">MB</span>
</div>
<div className="ml-3">
<p className="text-sm font-medium text-gray-900">Michael Brown</p>
<p className="text-sm text-gray-500">michael@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 18, 2025</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$175.00</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
Failed
</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="flex justify-between items-center mt-4">
<p className="text-sm text-gray-500">Showing 5 of 25 entries</p>
<div className="flex space-x-1">
<button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded !rounded-button whitespace-nowrap">Previous</button>
<button className="px-3 py-1 text-sm bg-blue-500 text-white rounded !rounded-button whitespace-nowrap">1</button>
<button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded !rounded-button whitespace-nowrap">2</button>
<button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded !rounded-button whitespace-nowrap">3</button>
<button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded !rounded-button whitespace-nowrap">Next</button>
</div>
</div>
</div>
</div>
</main>
</div>
);
};
export default App