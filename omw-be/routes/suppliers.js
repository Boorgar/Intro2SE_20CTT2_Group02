const express = require('express');
const router = express.Router();
const dbo = require('../db/connection');

router.post('/', function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    listing_id: req.body.id,
    last_modified: new Date(),
    session_id: req.body.session_id,
    direction: req.body.direction,
  };

  dbConnect
    .collection('matches')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});

router.get('/', function (req, res, next) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('suppliers')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching suppliers!');
      } else {
        res.json(result);
      }
    });
});

router.put('/:id', function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1,
    },
  };

  dbConnect
    .collection('suppliers')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

router.delete('/:id', (req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('suppliers')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = router;
