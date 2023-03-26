const knex = require("knex")(require("../knexfile"));
import uuidv4 from "uuidv4";

exports.index = (req, res) => {
  knex("inventories")
    .join("warehouses", "warehouse_id", "=", "warehouses.id")
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
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
    .then((numberofInventoriesDeleted) => {
      if (numberofInventoriesDeleted === 0) {
        return res.status(404).json({
          message: `Inventory item not found with id ${req.params.id}`,
        });
      }
      res.sendStatus(204);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

exports.singleItem = (req, res) => {
  knex("inventories")
    .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .where({ "inventories.id": req.params.id })
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({
          message: `Unable to find item with id: ${req.params.id}`,
        });
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

exports.addInventory = (req, res) => {
  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !req.body.quantity
  ) {
    return res.status(400).json({
      message: "Missing one or more required fields",
    });
  }

  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  knex("inventories")
    .where({ item_name: item_name, warehouse_id: warehouse_id })
    .then((warehouses) => {
      if (warehouses) {
        return res.status(400).json({
          message: `An item with the name: ${item_name} already exists in the warehouse: ${warehouse_id}.`,
        });
      }
      knex("inventories")
        .insert({
          item_name,
          description,
          category,
          status,
          quantity,
        })
        .then((createdIds) => {
          const itemId = uuidv4();

          return knex("warehouse").where({ id: warehouseId });
        })
        .then((warehouses) => {
          return res.status(201).json(warehouses[0]);
        })
        .catch((error) => {
          return res.status(400).json({
            message: "There was an issue with the request",
            error,
          });
        });
    });
};
