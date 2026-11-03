const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/Week8';
const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    gender: String,
    salary: Number,
    city: String
});

const Person = mongoose.model(
    'modelname',
    PersonSchema,
    'personCollection'
);

// Function to insert one document
async function insertOne(name, age, gender, salary) {
    const doc1 = new Person({
        name,
        age,
        gender,
        salary
    });

    const savedDoc = await doc1.save();
    return savedDoc;
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
    return result;
}

// Find all documents
async function findAll() {

    const docs = await Person.find({})
        .sort({ salary: 1 }) // sort by salary ascending
        .select('name salary age')
        .limit(100);

    console.log("Showing multiple documents");
    
    docs.forEach(doc => {
        console.log(doc.age, doc.name, doc.salary);
    });
    return docs;
}

// Find females with age >= 30
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
    return docs;
}

// Count total number of documents
async function countDocuments() {

    const count = await Person.countDocuments({});

    console.log('Total number of persons:', count);
    return count;
}

// Update many documents
async function updateManyPersons() {

    const result = await Person.updateMany(
        { gender: 'Female' },
        { $set: { salary: 5555 } }
    );

    console.log('Female persons updated');
    console.log(result);
    return result;
}

// Delete many documents
async function deleteManyPersons() {

    const result = await Person.deleteMany({
        age: { $gte: 45 }
    });

    console.log('Persons deleted');
    console.log(result);
    return result;
}

// Insert people with city information
async function insertCityPersons() {

    const cityPersons = [
        {
            name: 'John',age: 25,gender: 'Male', salary: 30000,city: 'London'
        },
        {
            name: 'Sarah',age: 32,gender: 'Female',salary: 35000,city: 'Manchester'
        },
        {
            name: 'David',age: 28,gender: 'Male',salary: 28000,city: 'Birmingham'
        }
    ];

    const result = await Person.insertMany(cityPersons);

    console.log('City persons inserted successfully');
    console.log(result);
}

// Find persons by city
async function findPersonsByCity() {

    const searchCity = 'London';

    const docs = await Person.find({
        city: searchCity
    });

    console.log(`Persons living in ${searchCity}:`);

    docs.forEach(doc => {
        console.log(doc.name, doc.age, doc.city);
    });
}


// Export functions for use in Express
module.exports = {
    Person,
    insertOne,
    insertMany,
    findAll,
    findFemalesOver30,
    countDocuments,
    updateManyPersons,
    deleteManyPersons,
    insertCityPersons,
    findPersonsByCity
};