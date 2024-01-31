const router = require("express").Router();

const authRoute = require("./authRoute");
const datasetRoute = require("./datasetRoute");

router.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Directions' APIs running successfully",
  });
});

router.use("/auth", authRoute);
router.use("/dataset", datasetRoute);



module.exports = router;
