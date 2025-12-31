const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    make: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    model: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1900,
            max: new Date().getFullYear() + 1
        }
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    mileage: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    transmission: {
        type: DataTypes.ENUM('Automatic', 'Manual'),
        defaultValue: 'Automatic'
    },
    fuelType: {
        type: DataTypes.ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric'),
        defaultValue: 'Petrol'
    },
    engineSize: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    bodyType: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    status: {
        type: DataTypes.ENUM('available', 'reserved', 'sold'),
        defaultValue: 'available'
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'vehicles',
    timestamps: true,
    indexes: [
        { fields: ['make'] },
        { fields: ['model'] },
        { fields: ['year'] },
        { fields: ['price'] },
        { fields: ['status'] },
        { fields: ['featured'] }
    ]
});

module.exports = Vehicle;
