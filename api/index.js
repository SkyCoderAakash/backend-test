import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Hello from server",
  });
});

const products = [
  {
    id: "1",
    name: "Apple",
  },
  {
    id: "2",
    name: "Mango",
  },
  {
    id: "3",
    name: "Banana",
  },
  {
    id: "4",
    name: "Papaya",
  },
];

app.get("/products", (req, res) => {
  res.json({
    status: "success",
    data: products,
  });
});

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`server is running on port no ${PORT}`);
// });

export default app;
