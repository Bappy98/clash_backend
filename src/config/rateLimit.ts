import rateLimit from "express-rate-limit";

export const appLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 100, 
    standardHeaders:'draft-07',
    legacyHeaders: false
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, 
    standardHeaders:'draft-08',
    legacyHeaders: false
});