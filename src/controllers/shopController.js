const Shop = require('../models/Shop')
const Block = require('../models/Block')
const { successResponse, errorResponse } = require('../utils/response')
const { saveBase64Image, deleteFile } = require('../utils/fileHelper')
const path = require('path')
const fs = require('fs')
const db = require('../config/database')

class ShopController {
  async index(req, res) {
    try {
      const keyword = req.query.q
      let shops
      if (keyword) {
        shops = await Shop.findByKeyword(keyword)
      } else {
        shops = await Shop.findAll()
      }
      return successResponse(res, 'Berhasil mengambil semua data toko', shops)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data toko', error.message)
    }
  }

  async store(req, res) {
    const { nama, pemilik, alamat, block_id, deskripsi } = req.body
    const uploadedFile = req.files?.foto

    // Validation
    if (!nama || !pemilik || !alamat || !block_id) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama, pemilik, alamat, dan block_id harus diisi',
        422
      )
    }

    if (!uploadedFile) {
      return res.status(400).send({
        code: 400,
        message: "Anda belum memasukkan foto.",
      })
    }

    try {
      // Validate block exists
      const block = await Block.findById(block_id)
      if (!block) {
        return errorResponse(
          res,
          'Ada kesalahan dalam pengisian form',
          'block_id tidak ditemukan',
          422
        )
      }

      let photoPath = null

      if (uploadedFile) {
        uploadedFile.name = uploadedFile.name.replace(/\s+/g, '_')
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const imageName = `${nama.replace(/ /g, '_')}_${date}.${uploadedFile.name.split('.').pop().toLowerCase()}`
        const uploadPath = path.join(__dirname, '../../public/photos/shops', imageName)

        await uploadedFile.mv(uploadPath)

        photoPath = `photos/shops/${imageName}`
      }

      const shop = await Shop.create({
        nama,
        pemilik,
        alamat,
        block_id,
        foto: photoPath,
        deskripsi,
      })

      return successResponse(res, 'Yeay! Toko baru berhasil ditambahkan', shop, 201)
    } catch (error) {
      return errorResponse(res, 'Ups! Ada masalah saat menambahkan toko', error.message)
    }
  }

  async show(req, res) {
    try {
      const shop = await Shop.findById(req.params.id)
      if (!shop) {
        return errorResponse(
          res,
          'Ups! Toko yang kamu cari tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }
      return successResponse(res, 'Data toko berhasil ditemukan', shop)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data toko', error.message)
    }
  }

  async update(req, res) {
    const { nama, pemilik, alamat, deskripsi } = req.body
    const uploadedFile = req.files?.foto

    if (!nama || !pemilik || !alamat) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama, pemilik, dan alamat harus diisi',
        422
      )
    }

    if (uploadedFile) {
      const parseExtension = uploadedFile.name.split(".")
      const extension = parseExtension[parseExtension.length - 1].toLowerCase()

      if (!["jpg", "png", "jpeg", "gif"].includes(extension)) {
        return res.status(400).send({
          code: 400,
          message: "Format foto tidak valid (harus .jpg, .jpeg, .png, atau .gif).",
        })
      }
    }

    try {
      const shop = await Shop.findById(req.params.id)
      if (!shop) {
        return errorResponse(
          res,
          'Ups! Toko yang mau diubah tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      await db.query('BEGIN')

      let photoPath = shop.foto

      if (uploadedFile) {
        // Delete old photo if exists
        if (shop.foto) {
          const oldPhotoPath = path.join(__dirname, '../../public', shop.foto)
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath)
          }
        }

        uploadedFile.name = uploadedFile.name.replace(/\s+/g, '_')
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const imageName = `${nama.replace(/ /g, '_')}_${date}.${extension}`
        const uploadPath = path.join(__dirname, '../../public/photos/shops', imageName)

        await uploadedFile.mv(uploadPath)

        photoPath = `photos/shops/${imageName}`
      }

      const updatedShop = await Shop.update(req.params.id, {
        nama,
        pemilik,
        alamat,
        foto: photoPath,
        deskripsi,
      })

      await db.query('COMMIT')

      return successResponse(res, 'Toko berhasil diperbarui', updatedShop)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat memperbarui toko', error.message)
    }
  }

  async destroy(req, res) {
    try {
      const shop = await Shop.findById(req.params.id)
      if (!shop) {
        return errorResponse(
          res,
          'Ups! Toko yang mau dihapus tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      // Delete shop photo
      if (shop.foto) {
        deleteFile(path.join(process.env.UPLOAD_DIR, shop.foto))
      }

      // Delete product photos
      if (shop.products) {
        shop.products.forEach((product) => {
          if (product.foto) {
            deleteFile(path.join(process.env.UPLOAD_DIR, product.foto))
          }
        })
      }

      await Shop.delete(req.params.id)
      return successResponse(res, 'Toko berhasil dihapus', null)
    } catch (error) {
      return errorResponse(res, 'Ups! Ada masalah saat menghapus toko', error.message)
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Shop.getProducts(req.params.id)
      return successResponse(res, 'Berhasil mengambil data produk toko', products)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data produk toko', error.message)
    }
  }
}

module.exports = new ShopController()
