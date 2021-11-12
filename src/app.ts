import express, { Request, Response } from "express";
import { connect } from "./db/connect";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello world");
});

app.listen(PORT, () => {
  console.log(`app is currently listening to port ${PORT}`);
  connect();
});

export default app;
