exports.index = (_req, res) => {
  res.send("Inventory homepage");
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

  // Check for unique item name
  knex("inventories")
    .where({ item_name: item_name })
    .then((inventories) => {
      if (inventories.length > 0) {
        return res.status(400).json({
          message: "Item already exists",
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
          const warehouseId = createdIds[0];

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
