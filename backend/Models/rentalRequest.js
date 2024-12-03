'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RentalRequest extends Model {
    static associate(models) {
      // Associate RentalRequest with User (Requestor)
      RentalRequest.belongsTo(models.User, {
        foreignKey: 'owner_id',
        as: 'requestor',
      });

      // Associate RentalRequest with Property
      RentalRequest.belongsTo(models.Property, {
        foreignKey: 'property_id',
        as: 'property',
      });
    }
  }

  RentalRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      property_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      modelName: 'RentalRequest',
      tableName: 'RentalRequests',
      timestamps: false,
    }
  );

  return RentalRequest;
};
