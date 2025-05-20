exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('house_numbers', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    block_id: {
      type: 'integer',
      notNull: true,
      references: 'blocks',
      onDelete: 'restrict',
    },
    nomor: {
      type: 'varchar(5)',
      notNull: true,
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'available', // available, occupied
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

  // Add composite unique constraint
  pgm.addConstraint('house_numbers', 'unique_block_number', {
    unique: ['block_id', 'nomor'],
  })

  // Add index
  pgm.createIndex('house_numbers', 'block_id')
}

exports.down = (pgm) => {
  pgm.dropConstraint('house_numbers', 'unique_block_number')
  pgm.dropIndex('house_numbers', 'block_id')
  pgm.dropTable('house_numbers')
}
