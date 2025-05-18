const Category = require('../models/Category')
const { successResponse, errorResponse } = require('../utils/response')
const db = require('../config/database')

class CategoryController {
  async index(req, res) {
    try {
      const categories = await Category.findAll()
      return successResponse(res, 'Berhasil mengambil semua data kategori', categories)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data kategori', error.message)
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
      const existing = await Category.findByName(nama)
      if (existing) {
        return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama sudah ada', 422)
      }

      // Begin transaction
      await db.query('BEGIN')

      const category = await Category.create({ nama, deskripsi })

      await db.query('COMMIT')

      return successResponse(res, 'Yeay! Kategori baru berhasil ditambahkan', category, 201)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menambahkan kategori', error.message)
    }
  }

  async show(req, res) {
    try {
      const category = await Category.findById(req.params.id)
      if (!category) {
        return errorResponse(
          res,
          'Ups! Kategori yang kamu cari tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }
      return successResponse(res, 'Data kategori berhasil ditemukan', category)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data kategori', error.message)
    }
  }

  async update(req, res) {
    const { nama, deskripsi } = req.body

    if (!nama) {
      return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama harus diisi', 422)
    }

    try {
      const category = await Category.findById(req.params.id)
      if (!category) {
        return errorResponse(
          res,
          'Ups! Kategori yang mau diubah tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      // Check for duplicate name
      const existing = await Category.findByName(nama, req.params.id)
      if (existing) {
        return errorResponse(res, 'Ada kesalahan dalam pengisian form', 'nama sudah ada', 422)
      }

      await db.query('BEGIN')

      const updatedCategory = await Category.update(req.params.id, {
        nama,
        deskripsi,
      })

      await db.query('COMMIT')

      return successResponse(res, 'Kategori berhasil diperbarui', updatedCategory)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat memperbarui kategori', error.message)
    }
  }

  async destroy(req, res) {
    try {
      const category = await Category.findById(req.params.id)
      if (!category) {
        return errorResponse(
          res,
          'Ups! Kategori yang mau dihapus tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      const hasProducts = await Category.hasProducts(req.params.id)
      if (hasProducts) {
        return errorResponse(
          res,
          'Ups! Kategori tidak bisa dihapus karena masih digunakan produk',
          'Kategori masih digunakan',
          422
        )
      }

      await db.query('BEGIN')

      await Category.delete(req.params.id)

      await db.query('COMMIT')

      return successResponse(res, 'Kategori berhasil dihapus', null)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menghapus kategori', error.message)
    }
  }
}

module.exports = new CategoryController()
