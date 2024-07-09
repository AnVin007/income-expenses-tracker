const Category = require("../../models/Category");
const Transaction = require("../../models/Transaction");
const appErr = require("../../utils/appErr");

//*===========================================================
//* ------> Create Category Controller
const createCategoryCtrl = async (req, res, next) => {
  //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
  //distructure req.body
  const { name, type } = req.body;

  // Check if all required parameters exists
  if (!name || !type) {
    return next(appErr("All required fields could not be empty"));
  }

  try {
    //! 1. Convert the name to lowercase
    const normalizedName = name.toLowerCase();

    //! 2. Check if the provided type is valid (Extra Validation)
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      return next(appErr("Invalid category type:" + type));
    }

    //! 3. Check if category exists on the user
    const categoryExist = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });

    if (categoryExist) {
      return next(
        appErr(
          `Category ${categoryExist.name} is already exist in the database`
        )
      );
    }

    //! 4. Create a category
    const category = await Category.create({
      user: req.user,
      name: normalizedName,
      type,
    });

    // Send response
    res.status(201).json({
      status: "successful",
      data: category,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Lists Categorys Controller
const listsCategoryCtrl = async (req, res, next) => {
  try {
    //Find all categories belongs to the user
    const categories = await Category.find({ user: req.user });

    // Send response
    res.status(200).json({
      status: "successful",
      data: categories,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Update Category Controller
const updateCategoryCtrl = async (req, res, next) => {
  // Get id from parameters and name/type from body of the request
  const categoryId = req.params.id;
  const { name, type } = req.body;
  // Normalize name
  const normalizedName = name.toLowerCase();
  try {
    //* --- Update Category itself ---
    //! 1. Find category by its id from DataBase
    const categoryFound = await Category.findById(categoryId);
    //! 2. Check if category NOT found OR Check if user id assigned to category is NOT equal to User's id who want to UPDATE
    if (
      !categoryFound ||
      categoryFound.user.toString() !== req.user.toString()
    ) {
      return next(appErr("Category not found OR User not Authorized"));
    }
    //! 3. Save old name of category to a variable, so you don't loose it when update to the new name
    const oldName = categoryFound.name;
    //! 4. Update Category to the new values from req.body
    categoryFound.name = normalizedName;
    if (type) {
      categoryFound.type = type;
    }

    //! 5. re-save the category
    const updatedCategory = await categoryFound.save();

    //* --- Update affected Transactions ---
    //! Check if user indeed changed the oldName to different name
    if (oldName !== updatedCategory.name) {
      //! Update all transactions that held old category name to new category name
      // use -> updateMany({provide filters},{set new value})
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        {
          $set: { category: updatedCategory.name },
        }
      );
    }

    //! 6. Send the response
    res.json({
      status: "successful",
      data: updatedCategory,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Delete Categories Controller
const deleteCategoryCtrl = async (req, res, next) => {
  // Get id from parameters and name/type from body of the request
  const categoryId = req.params.id;
  try {
    //! 1. Find category by its id from DataBase
    const categoryFound = await Category.findById(categoryId);
    //! 2. Check if category NOT found OR Check if user id assigned to category is NOT equal to User's id who want to UPDATE
    if (
      !categoryFound ||
      categoryFound.user.toString() !== req.user.toString()
    ) {
      return next(appErr("Category not found OR User not Authorized"));
    }

    //* Before Deleting category, need to find all related transactions and set the value "Uncategorized"
    //! 3. Set default value to category
    // use -> updateMany({provide filters},{set new value})
    await Transaction.updateMany(
      {
        user: req.user,
        category: categoryFound.name,
      },
      {
        $set: { category: "Uncategorized" },
      }
    );
    //! 4. Delete category
    await Category.findByIdAndDelete(categoryId);
    //! 5. Send the response
    res.json({
      status: "successful",
      data: null,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//* Export Modules
module.exports = {
  createCategoryCtrl,
  listsCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
