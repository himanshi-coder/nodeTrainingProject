const { Amenity, Category } = require('../Models'); // Adjust based on your model locations

// Controller to add a new amenity
const addAmenity = async (req, res) => {
  try {
    const { name } = req.body; // Get amenity name from request body

    // Check if name is not provided or is an empty string
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Amenity name is required and cannot be empty.' });
    }

    // Check if the amenity already exists
    const existingAmenity = await Amenity.findOne({ where: { name } });
    if (existingAmenity) {
      return res.status(400).json({ message: 'Amenity already exists' });
    }

    // Create a new amenity
    const amenity = await Amenity.create({ name });
    return res.status(201).json({ amenity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding amenity', error });
  }
};

// Controller to add a new category
const addCategory = async (req, res) => {
    try {
      const { name } = req.body; // Get category name from request body
  
      // Check if name is not provided or is an empty string
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required and cannot be empty.' });
      }
  
      // Check if the category already exists
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      // Create a new category
      const category = await Category.create({ name });
      return res.status(201).json({ category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding category', error });
    }
};

// Controller to fetch all amenities with pagination
const getAllAmenities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page to 1 and limit to 10

    // Convert to integer and ensure they are positive numbers
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const amenitiesLimit = parseInt(limit);

    // Fetch amenities with pagination
    const amenities = await Amenity.findAndCountAll({
      limit: amenitiesLimit,
      offset: offset,
      order: [['name', 'ASC']], // Optional: order by name
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(amenities.count / amenitiesLimit);

    // Return the paginated data
    return res.status(200).json({
      amenities: amenities.rows,
      totalItems: amenities.count,
      totalPages,
      currentPage: parseInt(page),
      itemsPerPage: amenitiesLimit,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching amenities', error });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page to 1 and limit to 10

    // Convert to integer and ensure they are positive numbers
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const categoriesLimit = parseInt(limit);

    // Fetch Category with pagination


    // A Sequelize method that:
      // findAndCountAll: Fetches a set of records based on the (limit, offset).
      // Returns records and the total count of rows in the database that match the query criteria.
      // Pagination Parameters:
        // limit: Specifies the maximum number of records to retrieve. This controls the size of each "page" of results.
        // offset: Specifies how many records to skip before starting to fetch the results. This is used to determine which page of data you want to retrieve.
      
        // for example - categoriesLimit = 10 (10 records per page) and offset = 20, it retrieves records 21–30 (0-based index).
          // LIMIT 10: Fetch 10 records.
          // OFFSET 20: Skip the first 20 records.
        // Raw query will be like this   
        // SELECT * FROM categories
          // ORDER BY name ASC
          // LIMIT 10 OFFSET 20;
          
          // SELECT COUNT(*) FROM categories;
    
    const categories = await Category.findAndCountAll({
      limit: categoriesLimit,
      offset: offset,
      order: [['name', 'ASC']], // Optional: order by name  
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(categories.count / categoriesLimit);

    // Return the paginated data
    return res.status(200).json({
      categories: categories.rows,
      totalItems: categories.count,
      totalPages,
      currentPage: parseInt(page),
      itemsPerPage: categoriesLimit,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching categories', error });
  }
};

module.exports = {
  addAmenity,
  addCategory,
  getAllAmenities, // get all Amenities 
  getAllCategories  // get all categories 
};






// module.exports = {
//   addAmenity,
//   addCategory,
// };

