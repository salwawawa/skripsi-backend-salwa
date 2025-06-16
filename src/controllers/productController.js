const Product = require('../models/Product')
const { successResponse, errorResponse } = require('../utils/response')
const { saveBase64Image, deleteFile } = require('../utils/fileHelper')
const path = require('path')
const fs = require('fs')
const db = require('../config/database')

class ProductController {
  async index(req, res) {
    try {
      const keyword = req.query.q
      let products
      if (keyword) {
        products = await Product.findByKeyword(keyword)
      } else {
        products = await Product.findAll()
      }
      return successResponse(res, 'Berhasil mengambil semua data produk', products)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data produk', error.message)
    }
  }

  async store(req, res) {
    const { shop_id, category_id, nama, harga, description } = req.body
    const uploadedFile = req.files?.foto

    // Validation
    if (!shop_id || !category_id || !nama || !harga) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'shop_id, category_id, nama, dan harga harus diisi',
        422
      )
    }

    if (!uploadedFile) {
      return res.status(400).send({
        code: 400,
        message: "Anda belum memasukkan foto.",
      })
    }

    if (isNaN(harga)) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'harga harus berupa angka',
        422
      )
    }

    const parseExtension = uploadedFile.name.split(".")
    const extension = parseExtension[parseExtension.length - 1].toLowerCase()

    if (!["jpg", "png", "jpeg", "gif"].includes(extension)) {
      return res.status(400).send({
        code: 400,
        message: "Format foto tidak valid (harus .jpg, .jpeg, .png, atau .gif).",
      })
    }

    try {
      // Check if shop and category exist
      const { shop_exists, category_exists } = await Product.checkExists(shop_id, category_id)
      if (!shop_exists) {
        return errorResponse(
          res,
          'Ada kesalahan dalam pengisian form',
          'shop_id tidak ditemukan',
          422
        )
      }
      if (!category_exists) {
        return errorResponse(
          res,
          'Ada kesalahan dalam pengisian form',
          'category_id tidak ditemukan',
          422
        )
      }

      await db.query('BEGIN')

      let photoPath = null

      if (uploadedFile) {
        uploadedFile.name = uploadedFile.name.replace(/\s+/g, '_')
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const imageName = `${shop_id}_${date}_${nama.replace(/ /g, '_')}.${extension}`
        const uploadPath = path.join(__dirname, '../../public/photos/products', imageName)

        await uploadedFile.mv(uploadPath)

        photoPath = `photos/products/${imageName}`
      }

      const product = await Product.create({
        shop_id,
        category_id,
        nama,
        harga,
        foto: photoPath,
        description,
      })

      await db.query('COMMIT')

      return successResponse(res, 'Yeay! Produk baru berhasil ditambahkan', product, 201)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menambahkan produk', error.message)
    }
  }

  async show(req, res) {
    try {
      const product = await Product.findById(req.params.id)
      if (!product) {
        return errorResponse(
          res,
          'Ups! Produk yang kamu cari tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }
      return successResponse(res, 'Data produk berhasil ditemukan', product)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data produk', error.message)
    }
  }

  async update(req, res) {
  const { shop_id, category_id, nama, harga, description } = req.body
  const uploadedFile = req.files?.foto

  if (!shop_id || !category_id || !nama || !harga) {
    return errorResponse(
      res,
      'Ada kesalahan dalam pengisian form',
      'shop_id, category_id, nama, dan harga harus diisi',
      422
    )
  }

  if (!uploadedFile) {
    return res.status(400).send({
      code: 400,
      message: "Anda belum memasukkan foto.",
    })
  }

  const parseExtension = uploadedFile.name.split(".")
  const extension = parseExtension[parseExtension.length - 1].toLowerCase()

  if (!["jpg", "png", "jpeg", "gif"].includes(extension)) {
    return res.status(400).send({
      code: 400,
      message: "Format foto tidak valid (harus .jpg, .jpeg, .png, atau .gif).",
    })
  }

  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return errorResponse(
        res,
        'Ups! Produk yang mau diubah tidak ditemukan',
        'Data tidak ditemukan',
        404
      )
    }

    await db.query('BEGIN')

    let photoPath = product.foto

    if (uploadedFile) {
      // Delete old photo if exists
      if (product.foto) {
        const oldPhotoPath = path.join(__dirname, '../../public', product.foto)
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath)
        }
      }

      uploadedFile.name = uploadedFile.name.replace(/\s+/g, '_')
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
      const imageName = `${shop_id}_${date}_${nama.replace(/ /g, '_')}.${extension}`
      const uploadPath = path.join(__dirname, '../../public/photos/products', imageName)

      await uploadedFile.mv(uploadPath)

      photoPath = `photos/products/${imageName}`
    }

    const updatedProduct = await Product.update(req.params.id, {
      shop_id,
      category_id,
      nama,
      harga,
      foto: photoPath,
      description,
    })

    await db.query('COMMIT')

    return successResponse(res, 'Produk berhasil diperbarui', updatedProduct)
  } catch (error) {
    await db.query('ROLLBACK')
    return errorResponse(res, 'Ups! Ada masalah saat memperbarui produk', error.message)
  }
}


  async destroy(req, res) {
    try {
      const product = await Product.findById(req.params.id)
      if (!product) {
        return errorResponse(
          res,
          'Ups! Produk yang mau dihapus tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      await db.query('BEGIN')

      if (product.foto) {
        deleteFile(path.join(process.env.UPLOAD_DIR, product.foto))
      }

      await Product.delete(req.params.id)

      await db.query('COMMIT')

      return successResponse(res, 'Produk berhasil dihapus', null)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menghapus produk', error.message)
    }
  }
}

module.exports = new ProductController()
