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
      res.json(data[0]);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Issue with request",
        err,
      });
    });
};

exports.addInventory = (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  const newID = uuidv4();

  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    (!req.body.quantity && req.body.status === "In Stock") // Only check quantity value if the item is said to be In Stock
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: warehouse id, item name, description, category, status, quantity",
    });
  }

  const isInt = parseInt(quantity);
  if (!Number.isInteger(isInt)) {
    return res.status(400).json({
      message: "Please enter a number value",
    });
  }

  knex("inventories")
    .where({ warehouse_id: warehouse_id })
    .then((inventories) => {
      if (inventories.length === 0) {
        return res.status(400).json({
          message: "There is no warehouse matching the inputed id",
        });
      }
    });

  knex("inventories")
    .insert({
      id: newID,
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
        .where({ id: newID });
    })
    .then((inventories) => {
      return res.status(201).json(inventories[0]);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

exports.editInventory = (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    (!req.body.quantity && req.body.status === "In Stock") // Only check quantity value if the item is said to be In Stock
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: warehouse id, item name, description, category, status, quantity",
    });
  }

  const isInt = parseInt(quantity);
  if (!Number.isInteger(isInt)) {
    return res.status(400).json({
      message: "Please enter a number value",
    });
  }

  knex("inventories")
    .where({ warehouse_id: warehouse_id })
    .then((inventories) => {
      if (inventories.length === 0) {
        return res.status(400).json({
          message: "There is no warehouse matching the inputed id",
        });
      }
    });

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
          message: `Unable to find warehouse with id: ${req.params.id}`,
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
