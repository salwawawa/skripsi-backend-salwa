const Activity = require('../models/Activity')
const { successResponse, errorResponse } = require('../utils/response')
const { saveBase64Image, deleteFile } = require('../utils/fileHelper')
const path = require('path')
const fs = require('fs')
const db = require('../config/database')

// TESTING 


class ActivityController {
  async index(req, res) {
    try {
      const keyword = req.query.q
      let activities
      if (keyword) {
        activities = await Activity.findByKeyword(keyword)
      } else {
        activities = await Activity.findAll()
      }
      return successResponse(res, 'Berhasil mengambil semua data kegiatan', activities)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data kegiatan', error.message)
    }
  }

  async store(req, res) {
    const { nama, waktu_pelaksanaan, peserta, deskripsi, lokasi } = req.body
    const uploadedFile = req.files?.foto

    if (!nama || !waktu_pelaksanaan || !lokasi) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama, waktu_pelaksanaan, dan lokasi harus diisi',
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

    if (!["jpg", "png", "jpeg"].includes(extension)) {
      return res.status(400).send({
        code: 400,
        message: "Format foto tidak valid (harus .jpg, .jpeg, atau .png).",
      })
    }

    try {
      await db.query('BEGIN')

      let photoPath = null

      if (uploadedFile) {
        uploadedFile.name = uploadedFile.name.replace(/\s+/g, '_')
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const imageName = `${nama.replace(/ /g, '_')}_${date}.${extension}`
        const uploadPath = path.join(__dirname, '../../public/photos/activities', imageName)

        await uploadedFile.mv(uploadPath)

        photoPath = `photos/activities/${imageName}`
      }

      const activity = await Activity.create({
        nama,
        waktu_pelaksanaan,
        peserta,
        deskripsi,
        lokasi,
        foto: photoPath,
      })

      await db.query('COMMIT')

      return successResponse(res, 'Yeay! Kegiatan baru berhasil ditambahkan', activity, 201)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menambahkan kegiatan', error.message)
    }
  }

  async show(req, res) {
    try {
      const activity = await Activity.findById(req.params.id)
      if (!activity) {
        return errorResponse(
          res,
          'Ups! Kegiatan yang kamu cari tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }
      return successResponse(res, 'Data kegiatan berhasil ditemukan', activity)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data kegiatan', error.message)
    }
  }

  async update(req, res) {
    // Adjusted to accept waktu_pelaksanaan as waktu_pelaksanaan or waktu_pelaksanaan (case-insensitive)
    const { nama, waktu_pelaksanaan, waktu_pelaksanaan: waktuPelaksanaan, peserta, deskripsi, lokasi } = req.body
    const uploadedFile = req.files?.foto

    console.log('req.body:', req.body)
    console.log('req.files:', req.files)

    // Use waktu_pelaksanaan or waktuPelaksanaan whichever is present
    const waktuPelaksanaanValue = waktu_pelaksanaan || waktuPelaksanaan

    if (!nama || !waktuPelaksanaanValue || !lokasi) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama, waktu_pelaksanaan, dan lokasi harus diisi',
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

    if (!["jpg", "png", "jpeg"].includes(extension)) {
      return res.status(400).send({
        code: 400,
        message: "Format foto tidak valid (harus .jpg, .jpeg, atau .png).",
      })
    }

    try {
      const activity = await Activity.findById(req.params.id)
      if (!activity) {
        return errorResponse(
          res,
          'Ups! Kegiatan yang mau diubah tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      await db.query('BEGIN')

      let photoPath = activity.foto

      if (uploadedFile) {
        // Delete old photo if exists
        if (activity.foto) {
          const oldPhotoPath = path.join(__dirname, '../../public', activity.foto)
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath)
          }
        }

        uploadedFile.name = uploadedFile.name.replace(/\s+/g, '_')
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const imageName = `${nama.replace(/ /g, '_')}_${date}.${extension}`
        const uploadPath = path.join(__dirname, '../../public/photos/activities', imageName)

        await uploadedFile.mv(uploadPath)

        photoPath = `photos/activities/${imageName}`
      }

      const updatedActivity = await Activity.update(req.params.id, {
        nama,
        waktu_pelaksanaan,
        peserta,
        deskripsi,
        lokasi,
        foto: photoPath,
      })

      await db.query('COMMIT')

      return successResponse(res, 'Kegiatan berhasil diperbarui', updatedActivity)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat memperbarui kegiatan', error.message)
    }
  }

  async destroy(req, res) {
    try {
      const activity = await Activity.findById(req.params.id)
      if (!activity) {
        return errorResponse(
          res,
          'Ups! Kegiatan yang mau dihapus tidak ditemukan',
          'Data tidak ditemukan',
          404
        )
      }

      await db.query('BEGIN')

      if (activity.foto) {
        deleteFile(path.join(process.env.UPLOAD_DIR, activity.foto))
      }

      await Activity.delete(req.params.id)

      await db.query('COMMIT')

      return successResponse(res, 'Kegiatan berhasil dihapus', null)
    } catch (error) {
      await db.query('ROLLBACK')
      return errorResponse(res, 'Ups! Ada masalah saat menghapus kegiatan', error.message)
    }
  }
}

module.exports = new ActivityController()
