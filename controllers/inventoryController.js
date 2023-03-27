const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require("uuid");
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

exports.editInventory = (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    !quantity
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: warehouse_id, item_name, description, category, status, quantity",
    });
  }

  const isInt = parseInt(quantity);
  if (!Number.isInteger(isInt)) {
    return res.status(400).json({
      message: "Please enter a number value for the quantity",
    });
  }

  knex("inventories")
    .where({ id: req.params.id })
    .update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    })
    .then(() => {
      return knex("inventories")
        .select(
          "id",
          "warehouse_id",
          "item_name",
          "description",
          "category",
          "status",
          "quantity"
        )
        .where({ id: req.params.id });
    })
    .then((inventories) => {
      if (inventories.length === 0) {
        return res.status(404).json({
          message: `Unable to find inventory item with id: ${req.params.id}`,
        });
      }
      res.status(200).json(inventories[0]);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "There was an issue with the request",
        error,
      });
    });
};
