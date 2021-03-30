const express = require("express");

const Detail_each_product = require("../../models/Detail_each_product");
var cloudinary = require("cloudinary").v2;
const Product = require("../../models/Product");
const Router = express.Router();

cloudinary.config({
  cloud_name: "firstsolar",
  api_key: "863973881426155",
  api_secret: "SAIRK1Tki6YQhbehttF0FKs-Dmc",
});

Router.get("/", async (req, res) => {
  const result = await Product.findAll({});

  res.json({
    message: "GET Data successfull",
    data: result,
    err: false,
  });
});

Router.get("/:id", async (req, res) => {
  const result = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  const result_detail = await Detail_each_product.findOne({
    where: {
      product_id: result.id,
    },
  });
  res.json({
    message: "GET Data successfull",
    data: result,
    detail: result_detail,
    err: false,
  });
});

Router.post("/", async (req, res) => {
console.log(  req.body)
  const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
    upload_preset: "dev_setups",
  });

  const result = await Product.create({
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    image: uploadResponse.url,
    quantity: req.body.quantity,
    status: req.body.status,
    alias: req.body.alias,
  });

  const result_detail = await Detail_each_product.create({
    description: req.body.description,
    chassis_number: req.body.chassis_number,
    engine_number: req.body.engine_number,
    color_id: req.body.color_id,
    guarantee: req.body.guarantee,
  });
  res.json({
    message: "Add Booking Test Driving successfully",
    data: result,

    err: false,
  });
});

Router.put("/:id", async (req, res) => {
  console.log(req.body.description);

  const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
    upload_preset: "dev_setups",
  });

  const result = await Product.update(
    {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      image: uploadResponse.url,
      quantity: req.body.quantity,
      status: req.body.status,
      alias: req.body.alias,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  const result_detail = await Detail_each_product.update(
    {
      description: req.body.description,
      chassis_number: req.body.chassis_number,
      engine_number: req.body.engine_number,
      color_id: req.body.color_id,
      guarantee: req.body.guarantee,
    },
    {
      where: {
        product_id: req.params.id,
      },
    }
  );

  if (result == 1 && result_detail == 1) {
    res.json({
      message: "Update  Product successfully",
      err: false,
    });
  } else {
    res.json({
      message: "Data has not changed of Product successfully",
      err: true,
    });
  }
});

Router.delete("/:id", async (req, res) => {
  const result = await Product.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (result == 1) {
    res.json({
      message: "Delete successfull",
      err: false,
    });
  } else {
    res.json({
      message: "Your data is not available ",
      err: true,
    });
  }
});

module.exports = Router;
