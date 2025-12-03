// E_com/FE/src/components/Admin/AdvancedDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesStats } from '../../features/admin/dashboardSlice';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TimeRangeButton = ({ label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
            isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {label}
    </button>
);

const AdvancedDashboard = () => {
    const dispatch = useDispatch();
    const { salesData, isLoadingSales } = useSelector(state => state.dashboard);

    const [timeRange, setTimeRange] = useState('monthly');
    const [dates, setDates] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Đầu năm nay
        endDate: new Date().toISOString().split('T')[0], // Hôm nay
    });

    useEffect(() => {
        dispatch(fetchSalesStats({ ...dates, groupBy: 'month' }));
    }, [dispatch]);

    const handleTimeRangeChange = (range, groupBy) => {
        setTimeRange(range);
        const end = new Date();
        let start = new Date();

        if (range === 'yearly') start.setFullYear(start.getFullYear() - 1);
        if (range === 'quarterly') start.setMonth(start.getMonth() - 3);
        if (range === 'monthly') start.setMonth(start.getMonth() - 1);
        if (range === 'weekly') start.setDate(start.getDate() - 7);

        const newDates = {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
        };
        setDates(newDates);
        dispatch(fetchSalesStats({ ...newDates, groupBy }));
    };

    // Đảm bảo salesData luôn là array
    const validSalesData = Array.isArray(salesData) ? salesData : [];

    const chartData = {
        labels: validSalesData.map(d => d._id),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: validSalesData.map(d => d.totalRevenue || 0),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Lợi nhuận (VND)', // <-- BỘ DỮ LIỆU MỚI
                data: validSalesData.map(d => d.totalProfit || 0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Số đơn hàng',
                data: validSalesData.map(d => d.totalOrders || 0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y1', // Sử dụng trục tung thứ hai
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'VND' },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Số lượng' },
                grid: { drawOnChartArea: false }, // Chỉ vẽ lưới cho trục y chính
            },
        },
    };
    
    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Phân tích Kinh doanh</h2>
            
            {/* Nút chọn nhanh */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <p className="text-sm font-medium">Xem theo:</p>
                <TimeRangeButton label="Năm nay" onClick={() => handleTimeRangeChange('yearly', 'month')} isActive={timeRange === 'yearly'} />
                <TimeRangeButton label="Quý này" onClick={() => handleTimeRangeChange('quarterly', 'week')} isActive={timeRange === 'quarterly'} />
                <TimeRangeButton label="Tháng này" onClick={() => handleTimeRangeChange('monthly', 'day')} isActive={timeRange === 'monthly'} />
                <TimeRangeButton label="Tuần này" onClick={() => handleTimeRangeChange('weekly', 'day')} isActive={timeRange === 'weekly'} />
            </div>

            {/* Biểu đồ */}
            {isLoadingSales ? (
                <p>Đang tải biểu đồ...</p>
            ) : validSalesData.length > 0 ? (
                <Line options={chartOptions} data={chartData} />
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>Chưa có dữ liệu bán hàng trong khoảng thời gian này</p>
                    <p className="text-sm mt-2">Tạo đơn hàng để xem biểu đồ phân tích</p>
                </div>
            )}
        </div>
    );
};

export default AdvancedDashboard;