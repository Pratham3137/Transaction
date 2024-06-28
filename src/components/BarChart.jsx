import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="range" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartComponent;
