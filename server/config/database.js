const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for local development
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected Successfully');

    // Sync all models
    await sequelize.sync();
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
