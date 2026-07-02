module.exports = function(req, res, next) {

    const master = req.headers["x-master-key"];

    if (master !== process.env.MASTER_KEY) {
        return res.status(401).json({
            success: false,
            message: "Invalid Master Key."
        });
    }

    next();

}