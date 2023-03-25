import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class CashFlow extends Model {
    static associate = (models) => {
      const { Wallet } = models;

      CashFlow.hasOne(Wallet, { foreignKey: 'cash_flow_id', onDelete: 'SET NULL' });
    };
  }

  CashFlow.init(
    {
      id: {
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      income: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      expense: {
        allowNull: false,
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
      tableName: 'cash_flows',
    },
  );

  return CashFlow;
};
