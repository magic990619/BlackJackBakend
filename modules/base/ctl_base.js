module.exports.testConnection = async function(req, res) {
    try {
        console.log(req);
        res.status(201).json({success: true});
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}