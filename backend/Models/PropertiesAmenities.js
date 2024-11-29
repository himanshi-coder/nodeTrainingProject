// models/PropertiesAmenities.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PropertiesAmenities extends Model {}

  PropertiesAmenities.init(
    {
      property_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Properties', // Make sure this is the correct table name
          key: 'property_id',
        },
      },
      amenity_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Amenities', // Make sure this is the correct table name
          key: 'amenity_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'PropertiesAmenities',
      tableName: 'PropertiesAmenities', // Join table name
      timestamps: false, // Disable timestamps for the join table
    }
  );

  return PropertiesAmenities;
};
