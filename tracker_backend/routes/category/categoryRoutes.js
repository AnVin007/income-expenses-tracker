const express = require("express");
const {
  createCategoryCtrl,
  listsCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../controllers/category/categoryController");
const isAuth = require("../../middlewares/isAuth");

//* Create Router from express package
const categoryRoutes = express.Router();

//(POST) Create Category: /api/v1/categories/create
categoryRoutes.post("/create", isAuth, createCategoryCtrl);

//(GET) Get all Categories: /api/v1/categories/lists
categoryRoutes.get("/lists", isAuth, listsCategoryCtrl);

//(PUT) Update Category: /api/v1/categories/update/:id
categoryRoutes.put("/update/:id", isAuth, updateCategoryCtrl);

//(DELETE) Delete Category: /api/v1/categories/delete/:id
categoryRoutes.delete("/delete/:id", isAuth, deleteCategoryCtrl);

module.exports = categoryRoutes;
