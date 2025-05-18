const db = require('../config/database')

class Activity {
  static async findAll() {
    const query = `
      SELECT * FROM activities
      ORDER BY start_date DESC
    `
    const result = await db.query(query)
    return result.rows
  }

  static async create(data) {
    const { nama_kegiatan, start_date, end_date, deskripsi, tempat, foto } = data
    const query = `
      INSERT INTO activities (
        nama_kegiatan, start_date, end_date, deskripsi, tempat, foto
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const result = await db.query(query, [
      nama_kegiatan,
      start_date,
      end_date,
      deskripsi,
      tempat,
      foto,
    ])
    return result.rows[0]
  }

  static async findById(id) {
    const query = 'SELECT * FROM activities WHERE id = $1'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async update(id, data) {
    const { nama_kegiatan, start_date, end_date, deskripsi, tempat, foto } = data
    const query = `
      UPDATE activities
      SET nama_kegiatan = $1,
          start_date = $2,
          end_date = $3,
          deskripsi = $4,
          tempat = $5,
          foto = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `
    const result = await db.query(query, [
      nama_kegiatan,
      start_date,
      end_date,
      deskripsi,
      tempat,
      foto,
      id,
    ])
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM activities WHERE id = $1 RETURNING *'
    const result = await db.query(query, [id])
    return result.rows[0]
  }
}

module.exports = Activity
