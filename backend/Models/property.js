const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      // Association with User (Owner)
      Property.belongsTo(models.User, {
        foreignKey: 'owner_id',
        as: 'owner',
      });

      // Association with PropertyCategory
      Property.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });

      // Association with Amenity through a join table
      Property.belongsToMany(models.Amenity, {
        through: 'PropertiesAmenities',
        foreignKey: 'property_id',
        otherKey: 'amenity_id',
        as: 'amenities',
      });
    }
  }

  Property.init(
    {
      property_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      property_type: {
        type: DataTypes.ENUM('residential', 'commercial'),
        allowNull: false,
      },
      price_per_month: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR',
      },
      bedrooms: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bathrooms: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      square_feet: {
        type: DataTypes.STRING,
      },
      furnished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      address: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      available_from: {
        type: DataTypes.DATE,
      },
      lease_terms: {
        type: DataTypes.STRING,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false, // Ensure this field is required
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // amenities: { // Remove the following from your model, as it's handled by the association
      //   type: DataTypes.JSON,
      //   defaultValue: [],
      // },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Property',
      tableName: 'Properties',
    }
  );

  return Property;
};
