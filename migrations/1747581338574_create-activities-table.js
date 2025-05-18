/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('activities', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    nama_kegiatan: {
      type: 'varchar(100)',
      notNull: true,
    },
    start_date: {
      type: 'timestamp',
      notNull: true,
    },
    end_date: {
      type: 'timestamp',
      notNull: true,
    },
    deskripsi: {
      type: 'text',
      notNull: false,
    },
    tempat: {
      type: 'varchar(255)',
      notNull: true,
    },
    foto: {
      type: 'varchar(255)',
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
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('activities')
}
