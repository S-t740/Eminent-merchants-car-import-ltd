const { User } = require('../models');

/**
 * Initialize database with default admin user if none exists
 */
const initializeDatabase = async () => {
    try {
        // Check if any admin user exists
        const adminExists = await User.findOne({ where: { role: 'admin' } });

        if (!adminExists) {
            console.log('📝 No admin user found. Creating default admin...');

            // Create default admin - model will hash password automatically
            await User.create({
                name: 'Admin',
                email: 'staff@gmail.com',
                password: 'staff123',  // Plain password - model will hash it
                role: 'admin',
                isActive: true
            });

            console.log('✅ Default admin user created');
            console.log('   Email: staff@gmail.com');
            console.log('   Password: staff123');
            console.log('   ⚠️  Please change this password after first login!');
        } else {
            console.log('✅ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
    }
};

module.exports = { initializeDatabase };
