const express = require('express')
const cors = require('cors')
const path = require('path')
const shopRoutes = require('./routes/shopRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const activityRoutes = require('./routes/activityRoutes')
const blockRoutes = require('./routes/blockRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve static files
app.use('/photos', express.static(path.join(__dirname, '../public/photos')))

// Routes
app.use('/api/v1/shops', shopRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/activities', activityRoutes)
app.use('/api/v1/blocks', blockRoutes)

// Error handling
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
