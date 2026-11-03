const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require('mongoose');

const {
    insertOne,
    findAll,
    countDocuments,
    findFemalesOver30,
    insertMany,
    updateManyPersons,
    deleteManyPersons
} = require('./week4Practice');

const MONGO_URI = 'mongodb://localhost:27017/Week8';

console.log("RUNNING FILE:", __filename);

// Home route
app.get('/', (req, res) => {
    res.send('Hello! This is my first Express application.');
});

// About route
app.get('/about', (req, res) => {
    res.send('This is the About page.');
});

// Route with URL parameters
app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(req.params);
});

app.get('/GetStudents', (req, res) => {

    fs.readFile('./Students.json', 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error reading Students.json'
            });
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            requestedAt: new Date().toISOString(),
            requestUrl: req.originalUrl,
            requestMethod: req.method,
            studentData: JSON.parse(data)
        });

    });

});

app.get('/GetStudent/:id', (req, res) => {

    fs.readFile(__dirname + '/Students.json', 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error reading Students.json'
            });
        }

        const students = JSON.parse(data);

        const student = students['Student' + req.params.id];

        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'Student Not Found',
                requestedAt: new Date().toISOString(),
                requestUrl: req.originalUrl,
                requestMethod: req.method
            });
        }

    });

});



app.get('/studentinfo', (req, res) => {
    res.sendFile('StudentInfo.html', { root: __dirname });
});

app.post('/submit-data', (req, res) => {

    const name = req.body.firstName + ' ' + req.body.lastName;
    const age = req.body.myAge;
    const Gender = ' Gender: ' + req.body.gender;
    const qual = 'Qualification: ' + req.body.Qual;

    console.log(req.body.Qual);

    res.send({
        status: true,
        message: 'Form Details',
        data: {
            name: name,
            age: age,
            gender: Gender,
            qualification: qual
        }
    });

});

app.get('/persons', async (req, res) => {
    console.log("PERSONS ROUTE REACHED!");

    try {
        const result = await findAll();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

console.log("PERSONS ROUTE HAS BEEN REGISTERED");

app.get('/Showform', (req, res) => {
    res.sendFile('Personform.html', { root: __dirname });
});

app.post('/insertOne', async (req, res) => {
    try {
        const result = await insertOne(
            req.body.name,
            req.body.age,
            req.body.gender,
            req.body.salary
        );

        res.status(201).json({
            status: true,
            message: "Person inserted successfully",
            data: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.get('/countDocuments', async (req, res) => {
    try {
        const result = await countDocuments();

        res.json({
            status: true,
            message: 'Total number of persons retrieved successfully',
            totalPersons: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.get('/findFemalesOver30', async (req, res) => {
    try {
        const result = await findFemalesOver30();

        res.json({
            status: true,
            message: 'Female persons aged 30 or above retrieved successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.post('/insertMany', async (req, res) => {
    try {
        const result = await insertMany();

        res.status(201).json({
            status: true,
            message: 'Multiple persons inserted successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.put('/updateManyPersons', async (req, res) => {
    try {
        const result = await updateManyPersons();

        res.json({
            status: true,
            message: 'Female persons updated successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.delete('/deleteManyPersons', async (req, res) => {
    try {
        const result = await deleteManyPersons();

        res.json({
            status: true,
            message: 'Persons aged 45 or above deleted successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

// Start server
const PORT = 5000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });