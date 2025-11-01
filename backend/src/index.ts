import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use('/api',(req: Request, res : Response) =>{
  res.status(200).json({ message: 'Hello, TypeScript + Express!' });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
