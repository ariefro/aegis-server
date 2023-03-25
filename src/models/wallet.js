import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate = (models) => {
      const { User, CashFlow } = models;

      Wallet.belongsTo(User, { as: 'users', foreignKey: 'user_id' });
      Wallet.belongsTo(CashFlow, { as: 'total', foreignKey: 'cash_flow_id' });
    };
  }

  Wallet.init(
    {
      id: {
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'users',
          },
        },
        onDelete: 'SET NULL',
      },
      cash_flow_id: {
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'cash_flows',
          },
        },
        onDelete: 'SET NULL',
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      currency: {
        allowNull: false,
        type: DataTypes.ENUM('IDR'),
        defaultValue: 'IDR',
      },
      balance: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
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
      tableName: 'wallets',
    },
  );

  return Wallet;
};
