exports.shorthands = undefined

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
}

exports.down = (pgm) => {
  pgm.dropTable('blocks')
}
