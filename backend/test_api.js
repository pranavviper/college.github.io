const axios = require('axios');

const testAPI = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'newfaculty@rajalakshmi.edu.in',
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log('Login success.');

        // Fetch Applications
        const appRes = await axios.get('http://localhost:5001/api/applications', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const appId = appRes.data[0]._id;
        console.log('First App ID:', appId);

        // Reset to Peinding
        console.log('Resetting to Pending...');
        const updateRes = await axios.put(`http://localhost:5001/api/applications/${appId}/status`,
            { status: 'Pending' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Update Response:', updateRes.status, updateRes.data.status);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

testAPI();
