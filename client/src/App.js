// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import MonthDropdown from "./components/MonthDropdown";

const App = () => {
  const [month, setMonth] = useState("03");
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChart, setBarChart] = useState([]);
  const [pieChart, setPieChart] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCombinedData();
  }, [month, search, page]);

  const fetchCombinedData = async () => {
    const { data } = await axios.get("/api/combined-data", {
      params: { month, search, page },
    });
    setTransactions(data.transactions);
    setStatistics(data.statistics);
    setBarChart(data.barChart);
    setPieChart(data.pieChart);
  };

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <MonthDropdown month={month} setMonth={setMonth} />
      <Statistics statistics={statistics} />
      <TransactionsTable
        transactions={transactions}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
      />
      <BarChart data={barChart} />
      <PieChart data={pieChart} />
    </div>
  );
};

export default App;
