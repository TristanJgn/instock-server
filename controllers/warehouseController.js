const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require("uuid");

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
exports.addWarehouse = (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: warehouse name, address, city, country, contact name, contact position, contact phone number, contact email",
    });
  }

  // Use a regex expression to check for desired phone number format:
  // Must begin with a + followed by an areacode (1 or more digits) followed by a space
  // Must then be 3 digits contained in () followed by a space
  // Must then be 3 digits followed by a hyphen
  // Must end with 4 digits
  const phoneRegexValidation = /^(\+\d+)\s\(\d{3}\)\s\d{3}-\d{4}$/;
  if (!contact_phone.match(phoneRegexValidation)) {
    return res.status(400).json({
      message: "Please use a phone number format of +1 (123) 456-7890",
    });
  }

  // Use a regex expression to check for a valid email:
  // Must have 1 or more alphanumeric characters (allows for a dot, underscore, or hyphen as well) before an @ sign
  // Must then 1 or more alphanumeric characters before (not allowing for a dot, underscore, or hyphen) before a .
  // Must be followed by a domain which only has letters and is between 2-10 characters long
  const emailRegexValidation =
    /^([a-zA-Z\d._-]+)@([a-zA-Z\d]+)\.([a-zA-Z]{2,10})$/;
  if (!contact_email.match(emailRegexValidation)) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }

  const newWarehouseID = uuidv4();

  knex("warehouses")
    .insert({
      id: newWarehouseID,
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    })
    .then(() => {
      return knex("warehouses")
        .select(
          "id",
          "warehouse_name",
          "address",
          "city",
          "country",
          "contact_name",
          "contact_position",
          "contact_phone",
          "contact_email"
        )
        .where({ id: newWarehouseID });
    })
    .then((warehouses) => {
      return res.status(201).json(warehouses[0]);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "There was an issue with the request",
        error,
      });
    });
}

exports.singleWarehouseInventory = (req, res) => {
  knex("warehouses")
    .join (
      "inventories",
      "warehouses.id",
      "=",
      "inventories.warehouse_id"
    )
    .where({ "warehouses.id": req.params.id })
    .select(
      "inventories.id",
      "inventories.item_name",
      "inventories.category",
      "inventories.status",
      "inventories.quantity",
    )
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({
          message: `Unable to find warehouse with id: ${req.params.id}`,
        });
      }
      res.json(data); 
    })
    .catch((error) => {
      return res.status(500).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

exports.editWarehouse = (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message:
        "Missing one or more required fields: warehouse name, address, city, country, contact name, contact position, contact phone number, contact email",
    });
  }

  // Use a regex expression to check for desired phone number format:
  // Must begin with a + followed by an areacode (1 or more digits) followed by a space
  // Must then be 3 digits contained in () followed by a space
  // Must then be 3 digits followed by a hyphen
  // Must end with 4 digits
  const phoneRegexValidation = /^(\+\d+)\s\(\d{3}\)\s\d{3}-\d{4}$/;
  if (!contact_phone.match(phoneRegexValidation)) {
    return res.status(400).json({
      message: "Please use a phone number format of +1 (123) 456-7890",
    });
  }

  // Use a regex expression to check for a valid email:
  // Must have 1 or more alphanumeric characters (allows for a dot, underscore, or hyphen as well) before an @ sign
  // Must then 1 or more alphanumeric characters before (not allowing for a dot, underscore, or hyphen) before a .
  // Must be followed by a domain which only has letters and is between 2-10 characters long
  const emailRegexValidation =
    /^([a-zA-Z\d._-]+)@([a-zA-Z\d]+)\.([a-zA-Z]{2,10})$/;
  if (!contact_email.match(emailRegexValidation)) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }

  knex("warehouses")
    .where({ id: req.params.id })
    .update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    })
    .then(() => {
      return knex("warehouses")
        .select(
          "id",
          "warehouse_name",
          "address",
          "city",
          "country",
          "contact_name",
          "contact_position",
          "contact_phone",
          "contact_email"
        )
        .where({ id: req.params.id });
    })
    .then((warehouses) => {
      if (warehouses.length === 0) {
        return res.status(404).json({
          message: `Unable to find warehouse with id: ${req.params.id}`,
        });
      }
      res.status(200).json(warehouses[0]);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "There was an issue with the request",
        error,
      });
    });
}