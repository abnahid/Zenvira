import { auth } from "../lib/auth.js";
export const requireAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        req.user = session.user;
        req.session = session;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
export const requireRole = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions",
                });
            }
            next();
        }
        catch (error) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
    };
};
//# sourceMappingURL=auth.middleware.js.map