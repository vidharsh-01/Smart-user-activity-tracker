const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/track', require('./routes/trackRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.get('/', (req, res) => {
    res.redirect('http://localhost:5173/');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
