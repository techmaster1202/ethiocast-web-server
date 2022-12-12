const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(3000, () => {
    console.log(`Server listening on port 3000.`);
})