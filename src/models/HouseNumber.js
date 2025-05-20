const db = require('../config/database')

class HouseNumber {
  static async findAll() {
    const query = `
      SELECT hn.*, b.nama as block_name
      FROM house_numbers hn
      LEFT JOIN blocks b ON hn.block_id = b.id
      ORDER BY b.nama, hn.nomor
    `
    const result = await db.query(query)
    return result.rows
  }

  static async create(data) {
    const { block_id, nomor, status = 'available' } = data
    const query = `
      INSERT INTO house_numbers (block_id, nomor, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const result = await db.query(query, [block_id, nomor, status])
    return result.rows[0]
  }

  static async findByBlockAndNumber(block_id, nomor) {
    const query = `
      SELECT * FROM house_numbers
      WHERE block_id = $1 AND nomor = $2
    `
    const result = await db.query(query, [block_id, nomor])
    return result.rows[0]
  }

  static async findByBlock(block_id) {
    const query = `
      SELECT * FROM house_numbers
      WHERE block_id = $1
      ORDER BY nomor
    `
    const result = await db.query(query, [block_id])
    return result.rows
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE house_numbers
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `
    const result = await db.query(query, [status, id])
    return result.rows[0]
  }
}

module.exports = HouseNumber
