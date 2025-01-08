const express = require('express');
const app = express();
const port = process.env.PORT || 3000;  // Use the port provided by Render

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json());
app.use('/api', require('./tera'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});