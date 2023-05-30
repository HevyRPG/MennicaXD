const { Connection, Request } = require('tedious');

// Create connection configuration
const config = {
    server: '51.38.135.127',
    authentication: {
        type: 'default',
        options: {
            userName: 'Hafy2',
            password: 'KujWDubie.1'
        }
    },
    options: {
        database: 'Mennica',
        encrypt: true,
        port: 49170
    }
};

// Create connection
const connection = new Connection(config);

// Connect to the database
connection.on('connect', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }

    // Create the SELECT query
    const query = 'SELECT * FROM products';

    // Create the request object
    const request = new Request(query, (err, rowCount, rows) => {
        if (err) {
            console.error('Error executing the query:', err.message);
            return;
        }

        console.log(`Returned ${rowCount} row(s)`);
        console.log(rows);

        // Close the connection
        connection.close();
    });

    // Handle the result rows
    const rows = [];
    request.on('row', (columns) => {
        const row = {};
        columns.forEach((column) => {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });

    // Execute the request
    connection.execSql(request);
});

// Handle connection errors
connection.on('error', (err) => {
    console.error('Database connection error:', err.message);
});
