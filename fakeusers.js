const { MongoClient } = require('mongodb');  
const faker = require('faker');  
  
// Connection URI  
const uri = 'mongodb://mongodb1:27017'; // Assuming your MongoDB container is named "mongodb1"  
  
// Database Name  
const dbName = 'Atelier1'; // Change this to the name of your database  
  
// Function to generate a user object  
function generateUser() {  
  return {  
    name: faker.name.findName(),  
    age: faker.random.number({ min: 18, max: 80 }),  
    email: faker.internet.email(),  
    createdAt: faker.date.past().toISOString()  
  };  
}  
  
async function populateUsers() {  
  const client = new MongoClient(uri);  
  
  try {  
    await client.connect();  
  
    const db = client.db(dbName);  
    const usersCollection = db.collection('users');  
  
    // Generate 100 user documents  
    const users = Array.from({ length: 100 }, generateUser);  
  
    // Insert the generated user documents into the collection  
    const result = await usersCollection.insertMany(users);  
    console.log(`${result.insertedCount} users inserted successfully.`);  
  } catch (error) {  
    console.error('Error inserting users:', error);  
  } finally {  
    // Close the client  
    await client.close();  
  }  
}  
  
// Call the function to populate users  
populateUsers();
