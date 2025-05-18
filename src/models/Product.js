const db = require('../config/database')

class Product {
  static async findAll() {
    const query = `
      SELECT p.*,
        s.nama as shop_name,
        c.nama as category_name
      FROM products p
      LEFT JOIN shops s ON p.shop_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
    `
    const result = await db.query(query)
    return result.rows
  }

  static async create(data) {
    const { shop_id, category_id, nama, harga, foto, description } = data
    const query = `
      INSERT INTO products (shop_id, category_id, nama, harga, foto, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const result = await db.query(query, [shop_id, category_id, nama, harga, foto, description])
    return result.rows[0]
  }

  static async findById(id) {
    const query = `
      SELECT p.*,
        s.nama as shop_name,
        c.nama as category_name
      FROM products p
      LEFT JOIN shops s ON p.shop_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async update(id, data) {
    const { shop_id, category_id, nama, harga, foto, description } = data
    const query = `
      UPDATE products
      SET shop_id = $1, category_id = $2, nama = $3, harga = $4,
          foto = $5, description = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `
    const result = await db.query(query, [shop_id, category_id, nama, harga, foto, description, id])
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async checkExists(shopId, categoryId) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM shops WHERE id = $1
      ) as shop_exists,
      EXISTS(
        SELECT 1 FROM categories WHERE id = $2
      ) as category_exists
    `
    const result = await db.query(query, [shopId, categoryId])
    return result.rows[0]
  }
}

module.exports = Product
