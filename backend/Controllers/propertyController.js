const { Property, Amenity, Category, User } = require('../Models'); // Adjust based on your model locations

// Controller to add a new property
const addProperty = async (req, res) => {
  try {
    const { title, description, property_type, price_per_month, currency, bedrooms, bathrooms, square_feet, furnished, address, longitude, latitude, is_available, available_from, lease_terms, images, owner_id, category_id, amenities } = req.body;

    // Create a new property
    const property = await Property.create({
      title,
      description,
      property_type,
      price_per_month,
      currency,
      bedrooms,
      bathrooms,
      square_feet,
      furnished,
      address,
      longitude,
      latitude,
      is_available,
      available_from,
      lease_terms,
      images,
      owner_id,
      category_id,
    });

    // If there are amenities, associate them with the property
    if (amenities && amenities.length > 0) {
      const amenitiesData = await Amenity.findAll({
        where: {
          amenity_id: amenities,
        },
      });
      await property.addAmenities(amenitiesData); // Automatically associates amenities to the property
    }

    return res.status(201).json({ property });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding property', error });
  }
};

// Controller to edit an existing property
const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, property_type, price_per_month, currency, bedrooms, bathrooms, square_feet, furnished, address, longitude, latitude, is_available, available_from, lease_terms, images, category_id, amenities } = req.body;

    // Find the property by ID
    const property = await Propertie.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update property fields
    await property.update({
      title,
      description,
      property_type,
      price_per_month,
      currency,
      bedrooms,
      bathrooms,
      square_feet,
      furnished,
      address,
      longitude,
      latitude,
      is_available,
      available_from,
      lease_terms,
      images,
      category_id,
    });

    // Update amenities if provided
    if (amenities && amenities.length > 0) {
      const amenitiesData = await Amenity.findAll({
        where: {
          amenity_id: amenities,
        },
      });
      await property.setAmenities(amenitiesData); // Updates the relationship
    }

    return res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating property', error });
  }
};

// Controller to display all properties
const getAllProperties = async (req, res) => {
    try {
      // Extract page and limit from query params with defaults
      const { page = 1, limit = 10 } = req.query;
  
      // Calculate offset for pagination
      const propertiesLimit = parseInt(limit, 10); // Number of items per page
      const offset = (parseInt(page, 10) - 1) * propertiesLimit; // Skip items for previous pages
  
      // Fetch properties with pagination and associations
      const { count, rows: properties } = await Property.findAndCountAll({
        propertiesLimit,
        offset,
        distinct: true, // Ensure distinct counting of properties
        include: [
          {
            model: Amenity,
            as: 'amenities', // Include associated amenities
          },
          {
            model: Category,
            as: 'category', // Include associated category
          },
          {
            model: User,
            as: 'owner', // Include owner details
          },
        ],
      });
  
      // Send paginated response
      return res.status(200).json({
        properties,
        totalItems: count,
        totalPages: Math.ceil(count / propertiesLimit),
        currentPage: parseInt(page, 10),
        itemsPerPage: propertiesLimit,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching properties', error });
    }
  };
  

module.exports = {
  addProperty,
  editProperty,
  getAllProperties,
};
