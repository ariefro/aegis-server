import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate = (models) => {
      const { Wallet, Log } = models;

      User.hasMany(Wallet, { foreignKey: 'user_id' });
      User.hasMany(Log, { foreignKey: 'user_id' });
    };
  }

  User.init(
    {
      id: {
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
      token_version: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      tableName: 'users',
    },
  );

  return User;
};
