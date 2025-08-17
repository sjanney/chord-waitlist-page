module.exports = async (req, res) => {
    console.log('🏥 Health check endpoint called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'API is working correctly'
    };
    
    console.log('🏥 Health check response:', healthData);
    
    res.status(200).json(healthData);
};
