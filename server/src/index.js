const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("./Schema");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;
  const skip = (page - 1) * perPage;
  const match = {
    dateOfSale: {
      $gte: new Date(`2022-${month}-01`),
      $lt: new Date(`2022-${parseInt(month) + 1}-01`),
    },
  };

  if (search) {
    match.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { price: new RegExp(search, "i") },
    ];
  }

  const transactions = await Transaction.find(match)
    .skip(skip)
    .limit(parseInt(perPage));
  const total = await Transaction.countDocuments(match);

  res.json({ transactions, total });
});

// index.js (add this to the existing code)
app.get("/api/statistics", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(`2022-${parseInt(month) + 1}-01`);

  const totalSaleAmount = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  const totalSoldItems = await Transaction.countDocuments({
    dateOfSale: { $gte: startDate, $lt: endDate },
    sold: true,
  });
  const totalNotSoldItems = await Transaction.countDocuments({
    dateOfSale: { $gte: startDate, $lt: endDate },
    sold: false,
  });

  res.json({
    totalSaleAmount: totalSaleAmount[0]?.total || 0,
    totalSoldItems,
    totalNotSoldItems,
  });
});

// index.js (add this to the existing code)
app.get("/api/bar-chart", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(`2022-${parseInt(month) + 1}-01`);

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901-above", min: 901, max: Infinity },
  ];

  const result = await Promise.all(
    priceRanges.map(async (range) => {
      const count = await Transaction.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        price: { $gte: range.min, $lt: range.max },
      });

      return { range: range.range, count };
    })
  );

  res.json(result);
});

app.get("/api/pie-chart", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(`2022-${parseInt(month) + 1}-01`);

  const categories = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  res.json(categories);
});

// index.js (add this to the existing code)
app.get("/api/combined-data", async (req, res) => {
  const { month } = req.query;

  const [
    transactionsResponse,
    statisticsResponse,
    barChartResponse,
    pieChartResponse,
  ] = await Promise.all([
    axios.get(`http://localhost:${PORT}/api/transactions`, {
      params: { month },
    }),
    axios.get(`http://localhost:${PORT}/api/statistics`, { params: { month } }),
    axios.get(`http://localhost:${PORT}/api/bar-chart`, { params: { month } }),
    axios.get(`http://localhost:${PORT}/api/pie-chart`, { params: { month } }),
  ]);

  res.json({
    transactions: transactionsResponse.data,
    statistics: statisticsResponse.data,
    barChart: barChartResponse.data,
    pieChart: pieChartResponse.data,
  });
});

mongoose.connect("mongodb://localhost:27017/transactions", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
