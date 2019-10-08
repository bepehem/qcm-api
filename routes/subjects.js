var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET /subjects/ */
router.get('/', function (req, res, next) {
    const { db } = req.app.locals;
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
        query.name = new RegExp(req.query.search, 'i');
    }
    db.collection('subjects').find(query).count((err, count) => {
        db.collection('subjects')
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray((err, subjects) => res.json({ count: count, limit:limit, subjects: subjects }));
    })
});

/* GET /subjects/:id */

router.get('/:id', (req, res) => {
    const { db } = req.app.locals;
    const { id } = req.params;
    db.collection('subjects').findOne({ _id: new ObjectID(id) }, (err, subject) => res.json(subject));
});

/* PUT /subjects/:id */
router.put('/:id', (req, res) => {
    const { db } = req.app.locals;
    const { id } = req.params;
    db.collection('subjects').updateOne({ _id: new ObjectID(id) }, { $set: req.body }, (err, subject) => res.json(subject));
});

module.exports = router;
