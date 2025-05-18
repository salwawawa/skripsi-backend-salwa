const db = require('../config/database')

class Category {
  static async findAll() {
    const query = `
      SELECT c.*,
        COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as products
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
    `
    const result = await db.query(query)
    return result.rows
  }

  static async create(data) {
    const { nama, deskripsi } = data
    const query = `
      INSERT INTO categories (nama, deskripsi)
      VALUES ($1, $2)
      RETURNING *
    `
    const result = await db.query(query, [nama, deskripsi])
    return result.rows[0]
  }

  static async findById(id) {
    const query = `
      SELECT c.*,
        COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as products
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.id = $1
      GROUP BY c.id
    `
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async findByName(nama, excludeId = null) {
    const query = excludeId
      ? 'SELECT * FROM categories WHERE nama = $1 AND id != $2'
      : 'SELECT * FROM categories WHERE nama = $1'
    const params = excludeId ? [nama, excludeId] : [nama]
    const result = await db.query(query, params)
    return result.rows[0]
  }

  static async update(id, data) {
    const { nama, deskripsi } = data
    const query = `
      UPDATE categories
      SET nama = $1, deskripsi = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `
    const result = await db.query(query, [nama, deskripsi, id])
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async hasProducts(id) {
    const query = 'SELECT COUNT(*) FROM products WHERE category_id = $1'
    const result = await db.query(query, [id])
    return parseInt(result.rows[0].count) > 0
  }
}

module.exports = Category
