const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Amenity extends Model {
    static associate(models) {
      Amenity.belongsToMany(models.Property, {
        through: 'PropertiesAmenities',
        foreignKey: 'amenity_id',
        otherKey: 'property_id',
        as: 'properties',
      });
    }
  }

  Amenity.init(
    {
      amenity_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Amenity',
      tableName: 'Amenities',
      timestamps: false,
    }
  );

  return Amenity;
};
