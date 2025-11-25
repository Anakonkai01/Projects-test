// updateAdminRole.js
const mongoose = require('mongoose');

const USERS_MONGO_URI = process.env.USERS_MONGO_URI;

mongoose.connect(USERS_MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        
        // Update admin@microshop.com to ADMIN role
        const result = await usersCollection.updateOne(
            { email: 'admin@microshop.com' },
            { $set: { role: 'ADMIN' } }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} user(s)`);
        
        // Verify
        const admin = await usersCollection.findOne({ email: 'admin@microshop.com' });
        console.log('Admin user:', { email: admin.email, role: admin.role });
        
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
