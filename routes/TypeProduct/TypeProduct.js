const express = require("express");
const TypeProduct = require("../../models/TypeProduct");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const result = await TypeProduct.findAll({});

  res.json({
    message: "data tung loai xe",
    data: result,
    error: false,
    
  });
});
module.exports = Router;
