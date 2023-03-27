const knex = require("knex")(require("../knexfile"));

exports.index = (req, res) => {
  knex("inventories")
    .join (
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
      res.json(data[0]);
    })  
    .catch((err) => {
      res.status(500).json({
        message: "Issue with request",
        err,
      });
    });
};





