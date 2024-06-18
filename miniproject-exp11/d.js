const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// MongoDB connection URI including the database name
const uri = 'mongodb://localhost:27017/bus';
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    const query = url.parse(req.url).query;
    const params = querystring.parse(query);
    const name = params["name"];
    const email = params["email"];
    const phone = params["phone"];
    const date = params["date"];
    const busModel= params["busmodel"];
    const seatNumber = params["seat-number"];

    try {
        if (req.url.includes("/insert")) {
            await insertData(res, name, email, phone, date, busModel, seatNumber);
        } else if (req.url.includes("/delete")) {
            await deleteData(res,busModel, seatNumber);
        } else if (req.url.includes("/update")) {
            await updateData(res,busModel, seatNumber, phone);
        } else if (req.url.includes("/display")) {
            await displayTable(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Route not found');
        }
    } catch (error) {
        console.error('Request handling error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function insertData(res, name, email, phone, date,busModel, seatNumber) {
    try {
        const database = client.db('bus');
        const collection = database.collection('reservations');

        const reservation = {
            name,
            email,
            phone,
            date,
            busModel,
            seatNumber
        };

        const result = await collection.insertOne(reservation);
        console.log(`${result.insertedCount} document(s) inserted`);

        if (result.insertedCount === 1) {
            var htmlResponse = `
                <html>
                <head>
                    <title>Bus Reservation Details</title>
                    <style>
                        table {
                            width: 80%;
                            margin: auto;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: left;
                        }
                        th{
                            background-color:#ff5050;
                            color:white;
                        }
                        td {
                            background-color: #6a6a6a;
                            color:white;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                    </style>
                </head>
                <body>
                    <h1 style="text-align: center;">Bus Reservation Details</h1>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Bus Model</th>
                            <th>Seat Number</th>
                        </tr>
                        <tr>
                            <td>${name}</td>
                            <td>${email}</td>
                            <td>${phone}</td>
                            <td>${date}</td>
                            <td>${busModel}</td>
                            <td>${seatNumber}</td>
                        </tr>
                    </table>
                </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlResponse);
            res.end();
        } else {
            throw new Error('Document insertion failed');
        }
    } catch (error) {
        var htmlResponse=`
        <html>
            <head>
                <title>Error</title>
                <style>
                    .center {
                        text-align: center;
                        margin-top: 50px;
                    }
                </style>
            </head>
            <body>
                <div class="center">                
                    <h1 style="color:red; font-size:30px;">Booked Successfully</h1>
                </div>
            </body>
            </html>
        `;
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write(htmlResponse);
        res.end();
    }
}

async function deleteData(res, busModel, seatNumber) {
    try {
        const database = client.db('bus');
        const collection = database.collection('reservations');

        const filter = { busModel: busModel, seatNumber: seatNumber };

        const result = await collection.deleteOne(filter);
        console.log(`${result.deletedCount} document(s) deleted`);

        if (result.deletedCount === 1) {
            var htmlResponse=`
            <html>
            <head>
                <title>Error</title>
                <style>
                    .center {
                        text-align: center;
                        margin-top: 50px;
                    }
                </style>
            </head>
            <body>
                <div class="center">
                    <h1 style="color:red; font-size:30px;">Cancelled Successfully</h1>
                </div>
            </body>
            </html>
        `;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlResponse);
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Reservation not found');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Booked successfully');
    }
}

async function updateData(res, busModel, seatNumber, newPhone) {
    try {
        const database = client.db('bus');
        const collection = database.collection('reservations');

        const filter = { busModel: busModel, seatNumber: seatNumber };

        const updateDoc = {
            $set: { phone: newPhone }
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.modifiedCount} document(s) updated`);

        if (result.modifiedCount === 1) {
            var htmlResponse=`
            <html>
            <head>
                <title>Error</title>
                <style>
                    .center {
                        text-align: center;
                        margin-top: 50px;
                    }
                </style>
            </head>
            <body>
                <div class="center">
                    <h1 style="color:red; font-size:30px;">Updated Successfully</h1>
                </div>
            </body>
            </html>
        `;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlResponse);
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Reservation not found');
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function displayTable(res) {
    try {
        const database = client.db('bus');
        const collection = database.collection('reservations');

        const cursor = collection.find({});
        const reservations = await cursor.toArray();

        let tableHtml = `
            <html>
                <head>
                    <title>My Reservations</title>
                    <style>
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    table {
                        width: 80%;
                        margin: auto;
                        border-collapse: collapse;
                    }
                    header {
                        width: 100%;
                        background-color: #ff0000;
                        color: #fff;
                        padding: 10px 0;
                        text-align: center;
                        box-sizing: border-box;
                        padding-top:10px;
                        padding-bottom:10px;
                    }
                    header h2 {
                        margin: 0;
                        font-size:40px;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: red;
                        color: white;
                    }
                    td {
                        background-color:rgb(255, 194, 194);
                        color: black;
                    }
                    </style>
                </head>
                <body>
                <header>
                    <h2>My Reservations</h2>
                </header>
                <br>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Bus Model</th>
                            <th>Seat Number</th>
                        </tr>
        `;

        reservations.forEach(reservation => {
            tableHtml += `
                <tr>
                    <td>${reservation.name}</td>
                    <td>${reservation.email}</td>
                    <td>${reservation.phone}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.busModel}</td>
                    <td>${reservation.seatNumber}</td>
                </tr>
            `;
        });

        tableHtml += `
                    </table>
                </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(tableHtml);
        res.end();
    } catch (error) {
        console.error('Error displaying table:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// Create HTTP server
http.createServer(onRequest).listen(7050);
console.log('Server is running on http://localhost:7050');