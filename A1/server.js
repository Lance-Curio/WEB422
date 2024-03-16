/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Lance Curio Student ID: 104319223 Date: February 2, 2024
*
*  Published URL: https://drab-cyan-giraffe-wrap.cyclic.app/
*
********************************************************************************/
const express = require('express');
const app = express(); 
const cors = require('cors');
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();
const HTTP_PORT = process.env.PORT || 8080; 
require('dotenv').config();

app.use(express.json())
app.use(cors());
    
app.get('/', (req, res) =>{
    res.json({message: "API Listening"});
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
        app.listen(HTTP_PORT, ()=>{
            console.log(`server listening on: ${HTTP_PORT}`);
        });
}).catch((err)=>{
        console.log(err);
});

app.get('/api/listings', async (req, res) => {
  try{
      const listingObjs = await db.getAllListings(req.query.page, req.query.perPage, req.query.name);
      res.status(200).json(listingObjs);
  } catch(error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/listings', async (req, res) => {
    try {
        const newListing = await db.addNewListing(req.body);
        res.status(201).json(newListing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/listings/:id', async (req, res) => {
    try {
      const listing = await db.getListingById(req.params.id);
      if (!listing) {
        res.status(404).json({ message: 'Listing not found' });
      } else {
        res.json(listing);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.put('/api/listings/:id', async (req, res) => {
    try {
      const updatedListing = await db.updateListingById(req.body, req.params.id);
      if (!updatedListing) {
        res.status(404).json({ message: 'Listing not found' });
      } else {
        res.json({ message: 'Listing updated successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.delete('/api/listings/:id', async (req, res) => {
    try {
      const deletedListing = await db.deleteListingById(req.params.id);
      if (!deletedListing) {
        res.status(404).json({ message: 'Listing not found' });
      } else {
        res.json({ message: 'Listing deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});