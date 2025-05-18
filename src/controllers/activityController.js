const Activity = require('../models/Activity')
const { successResponse, errorResponse } = require('../utils/response')
const { saveBase64Image, deleteFile } = require('../utils/fileHelper')
const path = require('path')
const db = require('../config/database')

class ActivityController {
  async index(req, res) {
    try {
      const activities = await Activity.findAll()
      return successResponse(res, 'Berhasil mengambil semua data kegiatan', activities)
    } catch (error) {
      return errorResponse(res, 'Ups! Gagal mengambil data kegiatan', error.message)
    }
  }

  async store(req, res) {
    const { nama_kegiatan, start_date, end_date, deskripsi, tempat, foto } = req.body

    // Validation
    if (!nama_kegiatan || !start_date || !end_date || !tempat || !foto) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama_kegiatan, start_date, end_date, tempat, dan foto harus diisi',
        422
      )
    }

    // Validate dates
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    if (endDate <= startDate) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'end_date harus setelah start_date',
        422
      )
    }

    try {
      await db.query('BEGIN')

      let photoPath = null
      if (foto) {
        const extension = foto.split(';')[0].split('/')[1]
        const imageName = `${nama_kegiatan.replace(/ /g, '_')}.${extension}`
        photoPath = `photos/activities/${imageName}`

        await saveBase64Image(foto, 'activities', imageName)
      }

      const activity = await Activity.create({
        nama_kegiatan,
        start_date,
        end_date,
        deskripsi,
        tempat,
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
    const { nama_kegiatan, start_date, end_date, deskripsi, tempat, foto } = req.body

    if (!nama_kegiatan || !start_date || !end_date || !tempat) {
      return errorResponse(
        res,
        'Ada kesalahan dalam pengisian form',
        'nama_kegiatan, start_date, end_date, dan tempat harus diisi',
        422
      )
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
      if (foto) {
        if (activity.foto) {
          deleteFile(path.join(process.env.UPLOAD_DIR, activity.foto))
        }

        const extension = foto.split(';')[0].split('/')[1]
        const imageName = `${nama_kegiatan.replace(/ /g, '_')}.${extension}`
        photoPath = `photos/activities/${imageName}`

        await saveBase64Image(foto, 'activities', imageName)
      }

      const updatedActivity = await Activity.update(req.params.id, {
        nama_kegiatan,
        start_date,
        end_date,
        deskripsi,
        tempat,
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
