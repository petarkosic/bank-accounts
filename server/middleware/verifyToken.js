import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

export default function verifyToken(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access Denied!'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!verified) {
            return res.status(401).json({
                message: 'Invalid Token!'
            })
        }
        req.user = verified;
        next();

    } catch (error) {
        if (error instanceof jsonwebtoken.TokenExpiredError) {
            return res.status(401).json({
                message: 'Token expired'
            });
        } else if (error instanceof jsonwebtoken.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Invalid Token!'
            });
        } else {
            return res.status(500).json({
                message: 'Server Error'
            });
        }
    }
}