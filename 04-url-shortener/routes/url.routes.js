const express = require('express')
const router = express.Router()
const { shortenUrl, redirectToOriginalUrl, getUrlAnalytics, } = require('../controllers/url.controller')

// Shorten URL endpoint
router.post('/api/shorten', shortenUrl)

// Analytics endpoint
router.get('/api/analytics/:shortId', getUrlAnalytics)

// Redirection endpoint
router.get('/:shortId', redirectToOriginalUrl)

module.exports = router