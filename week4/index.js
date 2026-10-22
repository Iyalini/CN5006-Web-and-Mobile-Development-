const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/Week8';
const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    gender: String,
    salary: Number
});

const Person = mongoose.model(
    'modelname',
    PersonSchema,
    'personCollection'
);

// Function to insert one document
async function insertOne() {
    const doc1 = new Person({
        name: 'Iyal',
        age: 22,
        gender: 'Female',
        salary: 50000
    });
    const savedDoc = await doc1.save();
    console.log('One document inserted');
    console.log(savedDoc);
}

// Task 2: Insert many documents

async function insertMany() {

    const manypersons = [
        { name: 'SimonNHQ', age: 42, gender: 'Male', salary: 3456 },
        { name: 'NeeshaNN', age: 53, gender: 'Female', salary: 1000 },
        { name: 'MaryNHQ', age: 27, gender: 'Female', salary: 5402 },
        { name: 'MikeNJQ', age: 40, gender: 'Male', salary: 4519 }
    ];

    const result = await Person.insertMany(manypersons);
    console.log('Many documents inserted');
    console.log(result);
}

// Task 3: Find all documents, sort by salary ascending, and limit to 100

async function findAll() {

    const docs = await Person.find({})
        .sort({ salary: 1 }) // sort by salary ascending
        .select('name salary age')
        .limit(100);

    console.log("Showing multiple documents");
    
    docs.forEach(doc => {
        console.log(doc.age, doc.name, doc.salary);
    });
}

// Task 4: Find females with age >= 30

async function findFemalesOver30() {

    const givenAge = 30;

    const docs = await Person.find({
        gender: 'Female',
        age: { $gte: givenAge }
    })

    .sort({ salary: 1 })
    .select('name salary age')
    .limit(10);

    console.log(`Females aged ${givenAge} or above:`);

    docs.forEach(doc => {
        console.log(doc.age, doc.name, doc.salary);
    });
}

// Task 5: Count total documents in the collection
async function countDocuments() {
    const count = await Person.countDocuments();
    console.log("Total Documents Count:", count);
}

// Task 6: Delete all documents where age >= 25

async function deleteManyPersons() {
    const result = await Person.deleteMany({
      age: { $gte: 45 }
    });

    console.log("Deleted documents:", result);
}

// Task 7: Update all females' salary to 5555

async function updateManyPersons() {
    const result = await Person.updateMany(
        { gender: "Female" },
        { salary: 5555 }
    );
    console.log("Update successful");
    console.log(result);
}

async function main() {

    try {

        await mongoose.connect(MONGO_URI);
        console.log(`Connected to ${MONGO_URI}`);

        await insertOne();
        await insertMany();
        await findAll();
        await findFemalesOver30();
        await countDocuments();
        await deleteManyPersons();
        await updateManyPersons();
    } 
    catch (err) {
        console.error('Error:', err);
    } 
    
    finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}
main();
