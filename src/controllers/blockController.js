const Block = require('../models/Block')
const { successResponse, errorResponse } = require('../utils/response')
const db = require('../config/database')

class BlockController {
  async index(req, res) {
    try {
      const blocks = await Block.findAll()
      return successResponse(res, 'Berhasil mengambil semua data blok', blocks)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data blok', error.message)
    }
  }

  async store(req, res) {
    const { nama, deskripsi } = req.body

    // Validation
    if (!nama) {
      return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama harus diisi', 422)
    }

    try {
      // Check for duplicate name
      const existing = await Block.findByName(nama)
      if (existing) {
        return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama blok sudah ada', 422)
      }

      await db.query('BEGIN')

      const block = await Block.create({ nama, deskripsi })

      await db.query('COMMIT')

      return successResponse(res, 'Yeay! Blok baru berhasil ditambahkan', block, 201)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menambahkan blok', error.message)
    }
  }

  async show(req, res) {
    try {
      const block = await Block.findById(req.params.id)
      if (!block) {
        return errorResponse(
          res,
          'Ups! Blok yang kamu cari tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }
      return successResponse(res, 'Data blok berhasil ditemukan', block)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data blok', error.message)
    }
  }

  async update(req, res) {
    const { nama, deskripsi } = req.body

    if (!nama) {
      return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama harus diisi', 422)
    }

    try {
      const block = await Block.findById(req.params.id)
      if (!block) {
        return errorResponse(
          res,
          'Ups! Blok yang mau diubah tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      // Check for duplicate name
      const existing = await Block.findByName(nama)
      if (existing && existing.id !== block.id) {
        return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama blok sudah ada', 422)
      }

      await db.query('BEGIN')

      const updatedBlock = await Block.update(req.params.id, { nama, deskripsi })

      await db.query('COMMIT')

      return successResponse(res, 'Blok berhasil diperbarui', updatedBlock)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat memperbarui blok', error.message)
    }
  }

  async destroy(req, res) {
    try {
      const block = await Block.findById(req.params.id)
      if (!block) {
        return errorResponse(
          res,
          'Ups! Blok yang mau dihapus tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      if (block.shops.length > 0) {
        return errorResponse(
          res,
          'Ups! Blok tidak bisa dihapus karena masih memiliki toko',
          'Blok masih digunakan',
          422
        )
      }

      await db.query('BEGIN')

      await Block.delete(req.params.id)

      await db.query('COMMIT')

      return successResponse(res, 'Blok berhasil dihapus', null)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menghapus blok', error.message)
    }
  }

  async getShops(req, res) {
    try {
      const shops = await Block.getShops(req.params.id)
      return successResponse(res, 'Berhasil mengambil data toko di blok ini', shops)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data toko', error.message)
    }
  }
}

module.exports = new BlockController()
