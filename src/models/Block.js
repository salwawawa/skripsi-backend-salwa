const db = require('../config/database')

class Block {
  static async findAll() {
    const query = `
      SELECT b.*,
        COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL), '[]') as shops
      FROM blocks b
      LEFT JOIN shops s ON b.id = s.block_id
      GROUP BY b.id
      ORDER BY b.nama
    `
    const result = await db.query(query)
    return result.rows
  }

  static async create(data) {
    const { nama, deskripsi } = data
    const query = `
      INSERT INTO blocks (nama, deskripsi)
      VALUES ($1, $2)
      RETURNING *
    `
    const result = await db.query(query, [nama, deskripsi])
    return result.rows[0]
  }

  static async findById(id) {
    const query = `
      SELECT b.*,
        COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL), '[]') as shops
      FROM blocks b
      LEFT JOIN shops s ON b.id = s.block_id
      WHERE b.id = $1
      GROUP BY b.id
    `
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async findByName(nama) {
    const query = 'SELECT * FROM blocks WHERE nama = $1'
    const result = await db.query(query, [nama])
    return result.rows[0]
  }

  static async update(id, data) {
    const { nama, deskripsi } = data
    const query = `
      UPDATE blocks
      SET nama = $1, deskripsi = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `
    const result = await db.query(query, [nama, deskripsi, id])
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM blocks WHERE id = $1 RETURNING *'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async getShops(id) {
    const query = `
      SELECT s.*,
        COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as products
      FROM shops s
      LEFT JOIN products p ON s.id = p.shop_id
      WHERE s.block_id = $1
      GROUP BY s.id
    `
    const result = await db.query(query, [id])
    return result.rows
  }
}

module.exports = Block
