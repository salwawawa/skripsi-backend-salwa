const db = require('../config/database')

class Activity {
  static async findAll() {
    const query = "\
      SELECT * FROM activities \
      ORDER BY waktu_pelaksanaan DESC\
    "
    const result = await db.query(query)
    return result.rows
  }

  static async findByKeyword(keyword) {
    const query = "\
      SELECT * FROM activities \
      WHERE nama ILIKE $1 \
      ORDER BY waktu_pelaksanaan DESC\
    "
    const result = await db.query(query, [`%${keyword}%`])
    return result.rows
  }

  static async create(data) {
    const { nama, waktu_pelaksanaan, peserta, deskripsi, lokasi, foto } = data
    const query = "\
      INSERT INTO activities (\
        nama, waktu_pelaksanaan, peserta, deskripsi, lokasi, foto\
      ) VALUES ($1, $2, $3, $4, $5, $6)\
      RETURNING *\
    "
    const result = await db.query(query, [
      nama,
      waktu_pelaksanaan,
      peserta,
      deskripsi,
      lokasi,
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
    const { nama, waktu_pelaksanaan, peserta, deskripsi, lokasi, foto } = data
    const query = "\
      UPDATE activities \
      SET nama = $1, \
          waktu_pelaksanaan = $2, \
          peserta = $3, \
          deskripsi = $4, \
          lokasi = $5, \
          foto = $6, \
          updated_at = CURRENT_TIMESTAMP \
      WHERE id = $7 \
      RETURNING *\
    "
    const result = await db.query(query, [
      nama,
      waktu_pelaksanaan,
      peserta,
      deskripsi,
      lokasi,
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
