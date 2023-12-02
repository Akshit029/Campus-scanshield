const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;

// Initialize session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Middleware to check if the user is authenticated
const checkAuthentication = (req, res, next) => {
    if (req.session.authenticated) {
        next(); // User is authenticated, allow access
    } else {
        res.redirect('/login'); // Redirect to the login page
    }
};

// Serve a protected page
app.get('/dashboard', checkAuthentication, (req, res) => {
    res.send('Welcome to the protected page!');
});

// Serve a login page
app.get('/login', (req, res) => {
    res.send('Login Page');
});

// Handle login POST request (authentication logic)
app.post('/login', (req, res) => {
    // Check user credentials and set session variables
    if (req.body.username === 'user' && req.body.password === 'password') {
        req.session.authenticated = true;
        res.redirect('/dashboard'); // Redirect to the protected page
    } else {
        res.redirect('/login'); // Redirect back to login page on failed login
    }
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login'); // Redirect to the login page after logout
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
