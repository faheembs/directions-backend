const app = require("./src/app");

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Directions' APIs running on "http://localhost:${port}"`));