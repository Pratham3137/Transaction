import React from 'react';

const MonthDropdown = ({ month, setMonth }) => {
    const months = [
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ];

    return (
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m, index) => (
                <option key={index} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
        </select>
    );
};

export default MonthDropdown;
