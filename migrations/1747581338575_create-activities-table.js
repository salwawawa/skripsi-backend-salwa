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
    nama: {
      type: 'varchar(100)',
      notNull: true,
    },
    waktu_pelaksanaan: {
      type: 'varchar(255)',
      notNull: true,
    },
    peserta: {
      type: 'varchar(255)',
      notNull: true,
    },
    deskripsi: {
      type: 'text',
      notNull: false,
    },
    lokasi: {
      type: 'varchar(255)',
      notNull: false,
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
