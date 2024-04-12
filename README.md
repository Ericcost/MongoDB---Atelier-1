# Étape 1 : Set Up Mongo DB in ReplicaSet Mode

Installation of the mongoDB repo : 
```sudo apt-get install gnupg curl```

```curl -fsSL https://pgp.mongodb.com/server-7.0.asc |sudo gpg  --dearmor -o /etc/apt/trusted.gpg.d/mongodb-server-7.0.gpg```

```echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list```

Installation of MongoDB :
```sudo apt-get update```
```sudo apt-get install -y mongodb-org```
```sudo systemctl start mongod```
```sudo systemctl status mongod```
```sudo systemctl stop mongod```
```mongosh``` => to get access to the console

[Run MongoDB](https://medium.com/@arun0808rana/mongodb-installation-on-debian-12-8001d0dafb56)

Then create a [[Docker-compose]] :

==N.B :==
If you have any problem with your containers and you would like to remove them :
```
sudo docker stop mongodb1 mongodb2 mongodb3 
```

```
sudo docker rm mongodb1 mongodb2 mongodb3
```

Run : 
```
sudo docker compose up -d
```

Your 3 docker instances (mongodb1, mongodb2, mongodb3) should be created. 

To get access to the mongo shell console of one docker instance run ```
``` bash
sudo docker exec -it mongodb1 mongosh
```
`mongodb1` is the name of the container and `mongosh` is the command to get access to the mongo shell console within the docker container.

within this console run :
```javascript
rs.initiate({

  _id: "rs0",

  members: [

    { _id: 0, host: "mongodb1:27017" },

    { _id: 1, host: "mongodb2:27017" },

    { _id: 2, host: "mongodb3:27017" }

  ]

});
```

# Étape 2 : Generate Fake Datas

Create a new db : 
```javascript
use Atelier1
```

create a collection :
```javascript
db.createCollection("users")
```

To populate a db within the mongodb1 container you have to get access to the bash terminal : 
```sh
sudo docker -it mongodb1 bash 
```

Then you can create a [[nodejs script]] : `fakeusers.js`
==install mongodb and faker modules== :
`npm i faker`
`npm i mongodb`

you can run the `fakeusers.js` script by typing this following command : 
```sh
node fakeusers.js
100 users inserted successfully.
```

To avoid this error : `Error: Cannot find module '/etc/node_modules/faker/index.js'. Please verify that the package.json has a valid "main" entry`

run ```sudo npm i faker@5.5.3``` 

To verify if the script has work as expected return to the mongodb1 mongosh console and runf these following commands:

```javascript
use Atelier1
db.users.find()
db.users.find().pretty()
```

# Étape 3 : MongoDB CRUD

### Create user from CLI MongoDB

Insert one user 
``` javascript
use Atelier1

db.users.insertOne(
  {
	"name": "John Doe",
	"age": 30,
	"email": "john.doe@example.com",
	"createdAt": new Date(),   
	}
)
```

Insert many users
```javascript
use Atelier1

db.users.insertMany([
  {
	"name": "Mickael Plot",
	"age": 40,
	"email": "mickael@example.com",
	"createdAt": new Date(),   
  },
  {
	"name": "Felix Muller",
	"age": 40,
	"email": "felix@example.com",
	"createdAt": new Date(),   
  }
])
```

### Read user from CLI MongoD


Read one user 
```javascript
use Atelier1

db.users.find(
 {
	name: "John Doe"
 }
)
```

Read all users
```javascript
use Atelier1

db.users.find()
```

Specifiy Conditions Using Query Operators

```javascript
use Atelier1

db.users.find(
 {
   age: { $gte: 40}
 }
)
```

``` javascript
db.users.find( { age: { $gte: 40, $lte: 50 } } );
```

### Update user from CLI MongoD

update one user document
``` javascript
use Atelier1

db.users.updateOne(
 {
	name: "John Doe"
 },
 {
	$set: {
		age: 27
	}
 }
);
```

update multiple user documents
``` javascript
use Atelier1

db.users.updateMany(
 {
	age: { $gte: 40, $lte: 50 } // Filter criteria for documents with age between 40 & 50
 },
 {
	$set: {
		age: 39 // Set the age field to 39
	}
 }
);
```

replace a document 
``` javascript
use Atelier1

db.users.replaceOne(
 {
	name: "John Doe" // Filter criteria for documents with name John Doe
 },
 {
	name: "John Doe", age: 19, email: "john@replacetest.com", createdAt: new Date()
 }
);
```
### Delete user from CLI MongoD
to delete all documents : 
```javascript
use Atelier1

db.users.deleteMany({})
```

to delete all the document that matches a condition
```javascript
use Atelier1

db.users.deleteOnedelete({age:30})
```

# Étape 4 : Automate CRUD using a script
