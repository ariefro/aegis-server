import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate = (models) => {
      const { Wallet } = models;

      Transaction.belongsTo(Wallet, {
        as: 'wallets',
        foreignKey: 'wallet_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    };
  }

  Transaction.init(
    {
      id: {
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      wallet_id: {
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'wallets',
          },
        },
      },
      to_wallet_id: {
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'wallets',
          },
        },
      },
      currency: {
        allowNull: false,
        type: DataTypes.ENUM('IDR'),
        defaultValue: 'IDR',
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM('expense', 'income', 'transfer'),
      },
      slug: {
        type: DataTypes.ENUM('payout', 'top-up', 'transfer', 'payment'),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      tableName: 'transactions',
    },
  );

  return Transaction;
};
