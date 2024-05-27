import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const CancellationRatioPieChart = () => {
    const [cancellationRatio, setCancellationRatio] = useState(0);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/order/get-cancelled-ratio`)
            .then(response => response.json())
            .then(data => setCancellationRatio(data.roundedCancellationRatio))
            .catch(error => console.error('Error fetching cancellation ratio:', error));
    }, []);

    const data = [
        { name: 'Số đơn bị hủy', value: cancellationRatio },
        { name: 'Số đơn bình thường', value: 100 - cancellationRatio }
    ];
    const COLORS = ['#FF0000', '#0080FF']; // Màu đỏ và màu xanh dương
    return (
        <PieChart width={400} height={400}>
            <Pie
                dataKey="value"
                isAnimationActive={false}
                data={data}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                label
            >
                {
                    data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                }
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default CancellationRatioPieChart;



