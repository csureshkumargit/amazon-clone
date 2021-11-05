const express = require('express');
const route = express.Router();
const mobileController = require('../Controller/mobile');
route.get('/', mobileController.getMobileBrands);
route.get('/deals', mobileController.getMobileTopDeals);
route.get('/details/:productID', mobileController.getMobileDetailsByProductID);
route.get('/basic/:productID', mobileController.getMobileBasicDetailsByProductID);
route.get('/:mobile_id', mobileController.getMobileBrandByCollections);
route.post('/filter', mobileController.getMobileCollectionsByFilter);
module.exports = route;