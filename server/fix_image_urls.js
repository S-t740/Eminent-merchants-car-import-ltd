require('dotenv').config();
const { Vehicle } = require('./models');
const { connectDB } = require('./config/database');

const fixUrls = async () => {
    try {
        await connectDB();

        const vehicles = await Vehicle.findAll();
        console.log(`Analyzing ${vehicles.length} vehicles...`);

        let updatedCount = 0;
        for (const vehicle of vehicles) {
            if (vehicle.images && vehicle.images.length > 0) {
                let changed = false;
                const newImages = vehicle.images.map(img => {
                    if (img.url && img.url.includes(':5173')) {
                        changed = true;
                        return {
                            ...img,
                            url: img.url.replace(':5173', ':5000')
                        };
                    }
                    return img;
                });

                if (changed) {
                    vehicle.images = newImages;
                    await vehicle.save();
                    updatedCount++;
                    console.log(`✅ Updated URLs for vehicle: ${vehicle.title}`);
                }
            }
        }

        console.log(`\nDone! Updated ${updatedCount} vehicles.`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing URLs:', error);
        process.exit(1);
    }
};

fixUrls();
