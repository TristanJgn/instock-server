const knex = require("knex")(require("../knexfile"));

exports.index = (req, res) => {
  knex("inventories")
    .join(
      "warehouses",
      "warehouse_id",
      "=",
      "warehouses.id"
    )
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity",
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Issue with request",
        err,
      });
    });
};

exports.deleteInventory = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .del()
    .then(numberofInventoriesDeleted => {

      if (numberofInventoriesDeleted === 0) {
        return res.status(404).json({
          message: `Inventory item not found with id ${req.params.id}`
        })
      }
      res.sendStatus(204);
    })
    .catch(error => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error
      })
    })
}

exports.singleItem = (req, res) => {
  knex("inventories")
    .join (
      "warehouses",
      "inventories.warehouse_id",
      "=",
      "warehouses.id"
    )
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity",
    )
    .where({ "inventories.id": req.params.id })
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({
          message: `Unable to find item with id: ${req.params.id}`,
        })
      }
      res.json(data);
    })  
    .catch((err) => {
      res.status(500).json({
        message: "Issue with request",
        err,
      });
    });
};





