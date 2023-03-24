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






