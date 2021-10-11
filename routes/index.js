var express = require('express');
var router = express.Router();

var controller= require('../controllers/index');
const {MongoClient} = require("mongodb");

const apiVersion="v1";
const apiPrefix="/api/"+apiVersion;

router.get(apiPrefix+'/feed', (req,res)=>{
     controller.getFeed(req,res);
})

router.get(apiPrefix+'/items', (req,res)=>{
     console.log('item route good')
     controller.getItems(req,res);
})

router.post(apiPrefix+'/channel', (req,res)=>{
     controller.updateChannel(req,res);
})


module.exports = router;
