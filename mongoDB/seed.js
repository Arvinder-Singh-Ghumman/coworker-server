import mongoose from 'mongoose';
import faker from 'faker';
import User from '../models/user.js'; // Assuming you have a User model
import Listing from '../models/listing.js'; // Assuming you have a Listing model

async function seedDatabase() {

  try {
    // Define seed user data
    // const users = [];
    const userObjectIds = Array.from({ length: 100 }, () => new mongoose.Types.ObjectId());
    const users = userObjectIds.map((id, index) => ({
      _id: id,
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      password:  faker.internet.password()
    }));    

    // Insert seed user data into the User collection
    await User.insertMany(users);

    console.log('User seed data inserted successfully');

    // Define seed listing data
    const listings = [];
    for (let i = 1; i <= 100; i++) {
      listings.push({
        owner: users[i - 1]._id, // Assuming each listing is owned by one of the seeded users
        title: `Listing ${i}`,
        description: `Description for Listing ${i}`,
        price: i,
        location:"remote",
      });
    }

    // Insert seed listing data into the Listing collection
    await Listing.insertMany(listings);

    console.log('Listing seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
}

export default seedDatabase;
