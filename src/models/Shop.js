const db = require('../config/database')

class Shop {
  static async findAll() {
    const query = `
      SELECT s.*,
        b.nama as block_name,
        COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as products
      FROM shops s
      LEFT JOIN blocks b ON s.block_id = b.id
      LEFT JOIN products p ON s.id = p.shop_id
      GROUP BY s.id, b.nama
    `
    const result = await db.query(query)
    return result.rows
  }

  static async create(data) {
    const { nama, pemilik, alamat, block_id, foto, deskripsi } = data
    const query = `
      INSERT INTO shops (nama, pemilik, alamat, block_id, foto, deskripsi)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const result = await db.query(query, [nama, pemilik, alamat, block_id, foto, deskripsi])
    return result.rows[0]
  }

  static async findById(id) {
    const query = `
      SELECT s.*,
        COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as products
      FROM shops s
      LEFT JOIN products p ON s.id = p.shop_id
      WHERE s.id = $1
      GROUP BY s.id
    `
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async update(id, data) {
    const { nama, pemilik, alamat, foto, deskripsi } = data
    const query = `
      UPDATE shops
      SET nama = $1, pemilik = $2, alamat = $3, foto = $4, deskripsi = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `
    const result = await db.query(query, [nama, pemilik, alamat, foto, deskripsi, id])
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM shops WHERE id = $1 RETURNING *'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async getProducts(id) {
    const query = 'SELECT * FROM products WHERE shop_id = $1'
    const result = await db.query(query, [id])
    return result.rows
  }

  static async findByKeyword(keyword) {
    const query = `
      SELECT s.*,
        b.nama as block_name,
        COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as products
      FROM shops s
      LEFT JOIN blocks b ON s.block_id = b.id
      LEFT JOIN products p ON s.id = p.shop_id
      WHERE s.nama ILIKE $1
      GROUP BY s.id, b.nama
    `
    const result = await db.query(query, [`%${keyword}%`])
    return result.rows
  }
}

module.exports = Shop
