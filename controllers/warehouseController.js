const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  res.send("Warehouse homepage");
};

exports.singleWarehouse = (req, res) => {
  knex("warehouses")
    .select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email",
    ) // Exclude timestamps of created & updated 
    .where({ id: req.params.id })
    .then((warehouses) => {
      if (warehouses.length === 0) {
        return res.status(404).json({
          message: `Unable to find warehouse with id: ${req.params.id}`,
        });
      }

      res.json(warehouses[0]); // Will send back a 200 status code by default
    })
    .catch((error) => {
      return res.status(500).json({
        message: "There was an issue with the request",
        error,
      });
    });
};