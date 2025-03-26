const jwt = require('jsonwebtoken');

// middleware to check if user is logged in
module.exports.isLogined = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token, access denied' });
    }

    const token = authHeader.split(' ')[1];
    // console.log(token)
    // console.log(req.headers.user_id);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.headers.user_id = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
}