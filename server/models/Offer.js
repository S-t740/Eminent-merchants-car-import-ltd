const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Offer = sequelize.define('Offer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    discountPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    discountPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    vehicleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'vehicles',
            key: 'id'
        }
    }
}, {
    tableName: 'offers',
    timestamps: true
});

module.exports = Offer;
