const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router
  .route("/")
  .get(inventoryController.index)
  .post(inventoryController.addInventory);

router.route("/:id")
    .delete(inventoryController.deleteInventory)
    .get(inventoryController.singleItem);

module.exports = router;
