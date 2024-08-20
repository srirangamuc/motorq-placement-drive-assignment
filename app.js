const express = require("express");
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const multer = require('multer')

const app = express();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null,`${file.originalname}`)
    }
})

const upload = multer({storage})



// Correct MongoDB connection string with the database name 'farmers'
mongoose.connect("mongodb://localhost:27017/carsales", {
    // No need for deprecated options anymore
}).then(() => console.log('Database connection successful'))
  .catch(err => console.error("Database connection error", err));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        res.render("dashboard");
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.redirect('/signup');
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid email or password');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', upload.single('driver_license'), async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    if (!password) {
        return res.status(400).send("Password is required");
    }
    const driver_license = req.file ? req.file.path : "";
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            contact: { phone, email },
            driver_license,
            role
        });
        await newUser.save();
        req.session.userId = newUser._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error signing up customer: ", err);
        res.status(500).send("Error signing up customer");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
