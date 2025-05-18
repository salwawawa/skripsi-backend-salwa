/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    shop_id: {
      type: 'integer',
      notNull: true,
      references: 'shops',
      onDelete: 'cascade',
    },
    category_id: {
      type: 'integer',
      notNull: true,
      references: 'categories',
      onDelete: 'restrict',
    },
    nama: {
      type: 'varchar(100)',
      notNull: true,
    },
    harga: {
      type: 'decimal(10,2)',
      notNull: true,
    },
    foto: {
      type: 'varchar(255)',
      notNull: false,
    },
    description: {
      type: 'text',
      notNull: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  // Add foreign key indexes for better performance
  pgm.createIndex('products', 'shop_id')
  pgm.createIndex('products', 'category_id')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('products')
}
