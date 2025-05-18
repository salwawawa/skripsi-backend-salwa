const Shop = require('../models/Shop')
const { successResponse, errorResponse } = require('../utils/response')
const { saveBase64Image, deleteFile } = require('../utils/fileHelper')
const path = require('path')
const fs = require('fs')

class ShopController {
  async index(req, res) {
    try {
      const shops = await Shop.findAll()
      return successResponse(res, 'Berhasil mengambil semua data toko', shops)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data toko', error.message)
    }
  }

  async store(req, res) {
    const { nama, pemilik, alamat, foto, deskripsi } = req.body

    // Validation
    if (!nama || !pemilik || !alamat || !foto) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama, pemilik, alamat, dan foto harus diisi',
        422
      )
    }

    try {
      let photoPath = null
      if (foto) {
        const extension = foto.split(';')[0].split('/')[1]
        const imageName = `${nama.replace(/ /g, '_')}.${extension}`
        photoPath = `photos/shops/${imageName}`

        // Create directory if not exists
        const dir = path.join(process.env.UPLOAD_DIR, 'shops')
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }

        // Save image
        saveBase64Image(foto, 'shops', imageName)
      }

      const shop = await Shop.create({
        nama,
        pemilik,
        alamat,
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
    const { nama, pemilik, alamat, foto, deskripsi } = req.body

    if (!nama || !pemilik || !alamat) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama, pemilik, dan alamat harus diisi',
        422
      )
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

      let photoPath = shop.foto
      if (foto) {
        // Delete old photo
        if (shop.foto) {
          deleteFile(path.join(process.env.UPLOAD_DIR, shop.foto))
        }

        // Save new photo
        const extension = foto.split(';')[0].split('/')[1]
        const imageName = `${nama.replace(/ /g, '_')}.${extension}`
        photoPath = `photos/shops/${imageName}`
        saveBase64Image(foto, 'shops', imageName)
      }

      const updatedShop = await Shop.update(req.params.id, {
        nama,
        pemilik,
        alamat,
        foto: photoPath,
        deskripsi,
      })

      return successResponse(res, 'Toko berhasil diperbarui', updatedShop)
    } catch (error) {
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
