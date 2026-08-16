const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const Url = require('../models/url.model')

// Create short URL
// route : POST /api/shorten
exports.shortenUrl = async (req, res) => {
    const { originalUrl } = req.body
    const baseUrl = process.env.BASE_URL

    // Validate Base URL
    if (!validUrl.isUri(baseUrl)) {
        return res.status(400).json({ error: 'Invalid base URL configuration' })
    }

    // Validate User Input URL
    if (!validUrl.isUri(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL provided. Include http:// or https://' })
    }

    try {
        // Check if URL already exists in DB
        let url = await Url.findOne({ originalUrl })

        if (url) {
            return res.status(200).json({
                shortUrl: `${baseUrl}/${url.shortId}`,
                shortId: url.shortId,
                originalUrl: url.originalUrl,
                clicks: url.clicks,
            })
        }

        // Generate unique short code (8 chars)
        const shortId = nanoid(8)
        url = new Url({
            shortId,
            originalUrl,
            clicks: 0,
            visitHistory: [],
        })
        await url.save()

        return res.status(201).json({
            shortUrl: `${baseUrl}/${shortId}`,
            shortId,
            originalUrl,
            clicks: url.clicks,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Server Error' })
    }
}

// Redirect short code to original URL & track clicks
// route : GET /:shortId
exports.redirectToOriginalUrl = async (req, res) => {
    const { shortId } = req.params

    try {
        // Find URL and update visit count + history atomically
        const url = await Url.findOneAndUpdate(
            { shortId },
            {
                $inc: { clicks: 1 },
                $push: { visitHistory: { timestamp: new Date() } },
            },
            { new: true }
        )
        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' })
        }
        return res.redirect(url.originalUrl)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Server Error' })
    }
}

// Get analytics for a short URL
// route : GET /api/analytics/:shortId
exports.getUrlAnalytics = async (req, res) => {
    const { shortId } = req.params

    try {
        const url = await Url.findOne({ shortId })
        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' })
        }
        return res.status(200).json({
            shortId: url.shortId,
            originalUrl: url.originalUrl,
            totalClicks: url.clicks,
            visitHistory: url.visitHistory,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Server Error' })
    }
}