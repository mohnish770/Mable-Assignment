import express from "express";
import "./db/schema";
import audienceRoutes from "./routes/audienceRoutes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/v1/audiences", audienceRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});