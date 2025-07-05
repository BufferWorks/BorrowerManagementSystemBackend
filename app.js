// const express = require('express');
// const app = express();
// const port = 5000;
// const mongoose = require('mongoose');
// const path=require('path')
// const cors=require('cors')
// const cookieparser=require('cookie-parser')
// const expressSession=require('express-session')
// const config=require('config')
// const morgan=require('morgan')
// const {connectToDB}=require('./database/connection')
// const authRoutes=require('./routes/auth')
// const fetchRoutes=require('./routes/fetch')
// const installmentRoutes=require('./routes/installments')
// const updateRoutes=require('./routes/update')
// const deleteRoutes=require('./routes/delete')
// connectToDB()

// app.use(cors({
//   origin: ['https://borrower-management-system.vercel.app', 'http://localhost:3000', 'https://www.radharanifinanceservices.online'],
//   credentials: true
// }))

// app.use(morgan('dev'))
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieparser())
// app.use(expressSession({
//     secret:process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:false
// }))
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/auth',authRoutes)
// app.use('/fetch',fetchRoutes)
// app.use('/installment',installmentRoutes)
// app.use('/updateBorrower',updateRoutes)
// app.use('/deleteBorrower',deleteRoutes)


// app.get('/',(req,res)=>{
//     return res.status(200).json({message:"Working"})
// })


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const expressSession = require('express-session');
const config = require('config');
const morgan = require('morgan');
const { connectToDB } = require('./database/connection');

// Routes
const authRoutes = require('./routes/auth');
const fetchRoutes = require('./routes/fetch');
const installmentRoutes = require('./routes/installments');
const updateRoutes = require('./routes/update');
const deleteRoutes = require('./routes/delete');

// Middlewares
app.use(cors({
  origin: [
    'https://borrower-management-system.vercel.app',
    'http://localhost:3000',
    'https://www.radharanifinanceservices.online'
  ],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/auth', authRoutes);
app.use('/fetch', fetchRoutes);
app.use('/installment', installmentRoutes);
app.use('/updateBorrower', updateRoutes);
app.use('/deleteBorrower', deleteRoutes);

// Test route
app.get('/', (req, res) => {
  return res.status(200).json({ message: "Working" });
});

// 🚀 Start the server only after MongoDB connects
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB. Server not started.");
    process.exit(1);
  });


