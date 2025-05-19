/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('blocks', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    nama: {
      type: 'varchar(10)',
      notNull: true,
      unique: true,
    },
    deskripsi: {
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

  // Add block_id to shops table
  pgm.addColumn('shops', {
    block_id: {
      type: 'integer',
      notNull: true,
      references: 'blocks',
      onDelete: 'restrict',
    },
  })

  // Add index for better performance
  pgm.createIndex('shops', 'block_id')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropIndex('shops', 'block_id')
  pgm.dropColumn('shops', 'block_id')
  pgm.dropTable('blocks')
}
