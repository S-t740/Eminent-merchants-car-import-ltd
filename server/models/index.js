const User = require('./User');
const Vehicle = require('./Vehicle');
const Offer = require('./Offer');
const Inquiry = require('./Inquiry');

// Define associations
Vehicle.hasMany(Offer, { foreignKey: 'vehicleId', as: 'offers' });
Offer.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

Vehicle.hasMany(Inquiry, { foreignKey: 'vehicleId', as: 'inquiries' });
Inquiry.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

module.exports = {
    User,
    Vehicle,
    Offer,
    Inquiry
};
