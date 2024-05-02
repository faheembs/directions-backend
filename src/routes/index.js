const router = require("express").Router();

const authRoute = require("./authRoute");
const datasetRoute = require("./datasetRoute");
const usersRoute = require("./usersRoute");
const combinedDatasetRoute = require("./combinedDatasetRoute")
const thirdPartyDatasetRoute = require("./thirdPartyDatasetRoute")

router.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Directions' APIs running successfully",
  });
});

router.use("/auth", authRoute);
router.use("/dataset", datasetRoute);
router.use("/users", usersRoute);
router.use("/combinedDatasets", combinedDatasetRoute);
router.use("/thirdPartyDataset", thirdPartyDatasetRoute);



module.exports = router;
