const server = require("./src/app");

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Directions' APIs running on "http://localhost:${port}" `));
