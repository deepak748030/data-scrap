const express = require('express');
// require('./imgGenerate')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
// app.use(bodyParser.json());
app.use(express.json());
app.use('/api', require('./tera'));


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});