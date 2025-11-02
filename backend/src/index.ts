import express, { Application, Request, Response } from 'express';
import userRoutes from "./routes/user.routes";
import vehicleRoutes from './routes/vehicle.routes'
import { connectDB } from './config/db';
import cors from 'cors'
import dotenv from 'dotenv';
import locationRoutes from './routes/location.routes'

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Server is working" });
});

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/locations", locationRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

