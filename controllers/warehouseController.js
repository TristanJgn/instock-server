const knex = require("knex")(require("../knexfile"));

exports.index = (req, res) => {
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
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
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

exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .del()
    .then(numberofWarehousesDeleted => {

      if (numberofWarehousesDeleted === 0) {
        return res.status(404).json({
          message: `Warehouse not found with id ${req.params.id}`
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
};