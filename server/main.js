let express = require('express');

let app = express();

let port = process.env.PORT || 8080;

app.use(express.static('public'));

app.listen(port, () => console.log(`Running on ${port}`));
