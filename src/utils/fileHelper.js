const fs = require('fs')
const path = require('path')

const saveBase64Image = (base64String, folder, filename) => {
  // Create full directory path
  const uploadDir = path.join(__dirname, '../../public/photos', folder)

  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // Remove data:image/jpeg;base64, prefix
  const base64Image = base64String.split(';base64,').pop()

  // Create full file path
  const filePath = path.join(uploadDir, filename)

  // Save file
  fs.writeFileSync(filePath, base64Image, { encoding: 'base64' })

  // Return relative path for database
  return `photos/${folder}/${filename}`
}

const deleteFile = (filepath) => {
  const fullPath = path.join(__dirname, '../../public', filepath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}

module.exports = {
  saveBase64Image,
  deleteFile,
}
