'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User has many Properties
      User.hasMany(models.Property, {
        foreignKey: 'owner_id',
        // otherKey: 'property_id',
        as: 'properties',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID v4
        primaryKey: true
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      // user_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: {
        type: DataTypes.STRING, // Store OTP as a string
        allowNull: true, // Allow null initially
      },
      role: DataTypes.STRING,
      password: DataTypes.STRING,
      otp: {
        type: DataTypes.STRING, // Store OTP as a string
        allowNull: true, // Allow null initially
      },
      isVerified: DataTypes.ENUM('0', '1'),
      // access_token: DataTypes.STRING,
      // remember_me: DataTypes.BOOLEAN,
      status: DataTypes.ENUM('0', '1'),
      // reset_password_token: {
      //   type: DataTypes.STRING
      // },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
      },
      // deletedAt: {
      //   field: 'deleted_at',
      //   type: DataTypes.DATE
      // }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users', // Ensure this matches your table name in the DB
    }
  );
  return User;
};
