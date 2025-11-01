import express, { Application, Request, Response } from 'express';
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;

