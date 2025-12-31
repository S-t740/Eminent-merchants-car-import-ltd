const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inquiry = sequelize.define('Inquiry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    vehicleId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'vehicles',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('new', 'contacted', 'closed'),
        defaultValue: 'new'
    }
}, {
    tableName: 'inquiries',
    timestamps: true
});

module.exports = Inquiry;
