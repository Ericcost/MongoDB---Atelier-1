const { MongoClient } = require('mongodb');  
const faker = require('faker');  

// Connection URI  
const uri = 'mongodb://mongodb1:27017'; // Assuming your MongoDB container is named "mongodb1"  
  
// Database Name  
const dbName = 'Atelier1'; // Change this to the name of your database  

async function insertUsers() {  
  const client = new MongoClient(uri);  
  
  try {  
    await client.connect();  
  
    const db = client.db(dbName);  
    const usersCollection = db.collection('users');  
  
    // Function to generate a user object  
    function generateUser() {  
      return {  
        name: faker.name.findName(),  
        age: faker.random.number({ min: 18, max: 80 }),  
        email: faker.internet.email(),  
        createdAt: faker.date.past().toISOString()  
      };  
    }  
  
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

async function getUsersOver30() {  
  const client = new MongoClient(uri);  
  
  try {  
    await client.connect();  
  
    const db = client.db(dbName);  
    const usersCollection = db.collection('users');  
  
    // Find users older than 30
    const users = await usersCollection.find({ age: { $gt: 30 } }).toArray();
    console.log("Users older than 30:");
    console.log(users);
  } catch (error) {  
    console.error('Error fetching users over 30:', error);  
  } finally {  
    // Close the client  
    await client.close();  
  }  
}

async function updateUsersAge() {  
  const client = new MongoClient(uri);  
  
  try {  
    await client.connect();  
  
    const db = client.db(dbName);  
    const usersCollection = db.collection('users');  
  
    // Update ages of all users by adding 5 years
    const result = await usersCollection.updateMany({}, { $inc: { age: 5 } });
    console.log(`${result.modifiedCount} users' ages updated successfully.`);  
  } catch (error) {  
    console.error('Error updating users age:', error);  
  } finally {  
    // Close the client  
    await client.close();  
  }  
}

async function deleteUserByEmail(email) {  
  const client = new MongoClient(uri);  
  
  try {  
    await client.connect();  
  
    const db = client.db(dbName);  
    const usersCollection = db.collection('users');  
  
    // Delete user with specific email
    const result = await usersCollection.deleteOne({ email: email });
    console.log(`${result.deletedCount} user deleted successfully.`);  
  } catch (error) {  
    console.error('Error deleting user:', error);  
  } finally {  
    // Close the client  
    await client.close();  
  }  
}

async function execute() {
  // Call the function to insert generated users into the collection
  await insertUsers();

  // Call the function to read and display users over 30
  await getUsersOver30();

  // Call the function to update users' ages by adding 5 years
  await updateUsersAge();

  // Call the function to delete a specific user
  await deleteUserByEmail("example@example.com");
}

// Call the function to execute all operations
execute();

