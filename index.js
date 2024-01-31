const app = require("./src/app");
const connectDB = require("./src/config/database");

const port = process.env.PORT || 8000;
connectDB().then(res => { app.listen(port, () => console.log(`Directions' APIs running on "http://localhost:${port}"`)) })

