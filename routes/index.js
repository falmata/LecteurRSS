var express = require('express');
var router = express.Router();
var controller= require('../controllers/index');


const apiVersion="v1";
const apiPrefix="/api/"+apiVersion;


/**
 * @swagger
 * /api/v1/feed/:
 *   get:
 *     tags:
 *       - Feed
 *     description: retrieve information about channel rss.
 *     summary: retrieve information about channel rss.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Information about channel rss
 */
router.get(apiPrefix+'/feed', (req,res)=>{
     controller.getFeed(req,res);
})

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     tags:
 *       - Feed
 *     description: retrieve items.
 *     summary: retrieve information about channel rss.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Information about items feed rss
 */
router.get(apiPrefix+'/items', (req,res)=>{
     console.log('item route good')
     controller.getItems(req,res);
})


/**
 * @swagger
 * /api/v1/channel:
 *   post:
 *     tags:
 *       - Feed
 *     description: Update title or decription inforrmation of channel.
 *     summary: Update title or decription inforrmation of channel.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Information title or description are updated
 */
router.post(apiPrefix+'/channel', (req,res)=>{
     controller.updateChannel(req,res);
})


module.exports = router;
