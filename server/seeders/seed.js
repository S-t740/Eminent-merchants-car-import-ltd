require('dotenv').config();
const { sequelize, connectDB } = require('../config/database');
const { User, Vehicle, Offer } = require('../models');
const bcrypt = require('bcryptjs');

// Sample vehicle data
const sampleVehicles = [
    {
        title: '2022 Toyota Land Cruiser V8',
        make: 'Toyota',
        model: 'Land Cruiser',
        year: 2022,
        price: 12500000,
        mileage: 15000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        engineSize: '4.5L V8',
        color: 'Pearl White',
        bodyType: 'SUV',
        description: 'Pristine condition Toyota Land Cruiser V8 with full leather interior, sunroof, and all modern features. Perfect for both city driving and off-road adventures.',
        images: [],
        status: 'available',
        featured: true
    },
    {
        title: '2021 Mercedes-Benz C200',
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2021,
        price: 5800000,
        mileage: 28000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '2.0L Turbo',
        color: 'Obsidian Black',
        bodyType: 'Sedan',
        description: 'Elegant Mercedes-Benz C200 with AMG styling package. Features include panoramic sunroof, premium Burmester sound system, and advanced driver assistance.',
        images: [],
        status: 'available',
        featured: true
    },
    {
        title: '2020 BMW X5 xDrive40i',
        make: 'BMW',
        model: 'X5',
        year: 2020,
        price: 8500000,
        mileage: 35000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '3.0L Twin-Turbo',
        color: 'Mineral White',
        bodyType: 'SUV',
        description: 'Powerful BMW X5 with M Sport package. Loaded with premium features including heads-up display, gesture control, and Harman Kardon surround sound.',
        images: [],
        status: 'available',
        featured: true
    },
    {
        title: '2023 Mazda CX-5',
        make: 'Mazda',
        model: 'CX-5',
        year: 2023,
        price: 4200000,
        mileage: 8000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '2.5L',
        color: 'Soul Red Crystal',
        bodyType: 'SUV',
        description: 'Nearly new Mazda CX-5 with premium interior. Features Bose sound system, 360-degree camera, and advanced safety features.',
        images: [],
        status: 'available',
        featured: true
    },
    {
        title: '2019 Nissan X-Trail',
        make: 'Nissan',
        model: 'X-Trail',
        year: 2019,
        price: 2800000,
        mileage: 55000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '2.5L',
        color: 'Diamond Black',
        bodyType: 'SUV',
        description: 'Well-maintained 7-seater Nissan X-Trail. Perfect family vehicle with spacious interior and excellent fuel economy.',
        images: [],
        status: 'available',
        featured: false
    },
    {
        title: '2021 Subaru Forester',
        make: 'Subaru',
        model: 'Forester',
        year: 2021,
        price: 4500000,
        mileage: 22000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '2.5L',
        color: 'Jasper Green',
        bodyType: 'SUV',
        description: 'Reliable Subaru Forester with legendary AWD system. Features EyeSight driver assist technology and spacious cargo area.',
        images: [],
        status: 'available',
        featured: true
    },
    {
        title: '2020 Honda CR-V',
        make: 'Honda',
        model: 'CR-V',
        year: 2020,
        price: 3800000,
        mileage: 40000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '1.5L Turbo',
        color: 'Platinum White',
        bodyType: 'SUV',
        description: 'Popular Honda CR-V with Honda Sensing safety suite. Excellent fuel efficiency and renowned Honda reliability.',
        images: [],
        status: 'available',
        featured: false
    },
    {
        title: '2022 Volkswagen Tiguan',
        make: 'Volkswagen',
        model: 'Tiguan',
        year: 2022,
        price: 5200000,
        mileage: 18000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '2.0L TSI',
        color: 'Oryx White',
        bodyType: 'SUV',
        description: 'German engineering meets practicality. This Tiguan features a digital cockpit, panoramic sunroof, and advanced infotainment.',
        images: [],
        status: 'reserved',
        featured: false
    },
    {
        title: '2018 Range Rover Sport',
        make: 'Land Rover',
        model: 'Range Rover Sport',
        year: 2018,
        price: 7500000,
        mileage: 65000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        engineSize: '3.0L V6',
        color: 'Santorini Black',
        bodyType: 'SUV',
        description: 'Luxurious Range Rover Sport with commanding presence. Features include terrain response system, meridian sound, and premium leather.',
        images: [],
        status: 'available',
        featured: true
    },
    {
        title: '2021 Toyota Hilux Double Cab',
        make: 'Toyota',
        model: 'Hilux',
        year: 2021,
        price: 4800000,
        mileage: 30000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        engineSize: '2.8L D-4D',
        color: 'Silver Metallic',
        bodyType: 'Pickup',
        description: 'Indestructible Toyota Hilux double cab. Perfect for work and adventure with 4x4 capability and impressive towing capacity.',
        images: [],
        status: 'available',
        featured: false
    },
    {
        title: '2020 Audi Q5',
        make: 'Audi',
        model: 'Q5',
        year: 2020,
        price: 6200000,
        mileage: 32000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineSize: '2.0L TFSI',
        color: 'Navarra Blue',
        bodyType: 'SUV',
        description: 'Sophisticated Audi Q5 with quattro AWD. Features virtual cockpit, Matrix LED headlights, and premium Bang & Olufsen audio.',
        images: [],
        status: 'available',
        featured: false
    },
    {
        title: '2019 Mitsubishi Pajero',
        make: 'Mitsubishi',
        model: 'Pajero',
        year: 2019,
        price: 3500000,
        mileage: 48000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        engineSize: '3.2L DI-D',
        color: 'Warm White',
        bodyType: 'SUV',
        description: 'Legendary Mitsubishi Pajero with Super Select 4WD. Built for Kenyan roads with proven durability and comfort.',
        images: [],
        status: 'sold',
        featured: false
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Offer.destroy({ where: {} });
        await Vehicle.destroy({ where: {} });
        await User.destroy({ where: {} });

        console.log('👤 Creating admin user...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'staff@gmail.com',
            password: 'staff123',
            role: 'admin'
        });
        console.log(`   ✅ Admin created: ${adminUser.email}`);

        console.log('👥 Creating staff user...');
        const staffUser = await User.create({
            name: 'Staff Member',
            email: 'staff@emcil.co.ke',
            password: 'staff123',
            role: 'staff'
        });
        console.log(`   ✅ Staff created: ${staffUser.email}`);

        console.log('🚗 Creating sample vehicles...');
        const vehicles = await Vehicle.bulkCreate(sampleVehicles);
        console.log(`   ✅ Created ${vehicles.length} vehicles`);

        console.log('🏷️  Creating sample offers...');
        const featuredVehicles = vehicles.filter(v => v.featured);
        if (featuredVehicles.length > 0) {
            await Offer.create({
                title: 'New Year Special - 5% Off',
                description: 'Start the year with a new ride! Get 5% off on this vehicle.',
                discountPercentage: 5,
                vehicleId: featuredVehicles[0].id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                isActive: true
            });
            console.log('   ✅ Created 1 offer');
        }

        console.log(`
  ╔════════════════════════════════════════════════════╗
  ║          🎉 Database Seeded Successfully!          ║
  ╠════════════════════════════════════════════════════╣
  ║                                                    ║
  ║   Admin Login:                                     ║
  ║   Email: staff@gmail.com                           ║
  ║   Password: staff123                               ║
  ║                                                    ║
  ║   Staff Login:                                     ║
  ║   Email: staff@emcil.co.ke                         ║
  ║   Password: staff123                               ║
  ║                                                    ║
  ╚════════════════════════════════════════════════════╝
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
