var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

router.route('/')
  .get(function (req, res) {
    User.find({}).then(function (users, err) {
      if (!err) {
        res.status(200).send(users);
      } else {
        res.status(500).send(err);
      }
    });
  })
  .post(function (req, res) {
    var user = {
      nickname: '',
      headimg: '',
      unionid: '',
      scoreRecords: []
    };
    if (req.body.action == 'create') {
      delete req.body.action;
      let scoreRecords = {};
      for (let key in req.body) {
        let tempData = req.body[key];
        key = key.replace('data[0]', '').replace('[', '').replace(']', '');
        if (key == 'score' || key == 'type')
          scoreRecords[key] = tempData;
        user[key] = tempData;
      }
      console.log(scoreRecords);
      user.scoreRecords.push(scoreRecords);
      user = new User(user);
    } else {
      user = new User(req.body);
    }
    user.save(function (err, doc) {
      if (!err) {
        res.status(200).send(doc);
      } else {
        res.status(500).send(err);
      }
    });
  });

router.get('/formatted', async (req, res) => {
  try {
    const users = await User.find({});
    let formattedUsers = [];
    for (let i = 0; i < users.length; i++) {
      let scoreOf7Days = 0;
      let totalScore = 0;
      var filteredRecords = users[i].scoreRecords.filter(function (record) {
        return (new Date().getTime() - new Date(record.date).getTime()) < 3600 * 24 * 7 * 1000;
      });
      filteredRecords.map(function (item) {
        scoreOf7Days += item.score;
      });

      users[i].scoreRecords.map(function (item) {
        totalScore += item.score;
      });

      formattedUsers.push({
        "_id": users[i]._id,
        "unionid": users[i].unionid,
        "headimg": users[i].headimg,
        "nickname": users[i].nickname,
        "scoreOf7Days": scoreOf7Days,
        "totalScore": totalScore
      });
    }
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

});

router.post('/insertMany', function (req, res) {
  console.log(req.body.data);
  User.insertMany(req.body.data, function (error, docs) {
    if (!error) {
      return res.status(200).send(docs);
    } else {
      return res.status(500).send(error);
    }
  });
});

router.post('/delete', async (req, res) => {
  console.log(req.body);
  var ids = req.body.idArray;
  console.log(ids);
  try {
    await User.remove({"_id": {$in: ids}});
    return res.status(200).send({});
  } catch (e) {
    return res.status(500).send(e);
  }

});

router.use('/:_id', function (req, res, next) {
  User.findById(req.params._id).then(function (user, err) {
    if (err) {
      res.status(500).send(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send('no user found');
    }
  });
});

router.route('/:_id')
  .get(function (req, res) {
    var returnUser = req.user.toJSON();
    res.json(returnUser);
  })
  .put(function (req, res) {
    req.user.nickname = req.body.nickname;
    req.user.unionid = req.body.unionid;
    req.user.headimg = req.body.headimg;
    req.user.score = req.body.score;
    req.user.save().then(function (doc) {
      res.json(doc);
    }).catch(function (err) {
      res.status(500).send(err);
    });
  })
  .patch(function (req, res) {
    if (req.body._id)
      delete req.body._id;
    if (req.body.action == 'edit') {
      delete req.body.action;
      console.log(req.body);
      let scoreRecords = {};
      for (let key in req.body) {
        let tempData = req.body[key];
        key = key.slice(30).replace('[', '').replace(']', '');
        if (key == 'score' || key == 'type') {
          scoreRecords[key] = tempData;
        }
        req.user[key] = tempData;
      }
      req.user.scoreRecords.push(scoreRecords);
    } else {
      for (let p in req.body) {
        // if (req.user.hasOwnProperty(p)) {
        req.user[p] = req.body[p];
        // }
      }
    }
    console.log("修改后的数据是：", req.user);
    req.user.save().then(function (doc) {
      console.log("返回的数据是：", doc)
      res.json(doc);
    }).catch(function (err) {
      console.log(err);
      res.status(500).send(err);
    });
  })
  .delete(function (req, res) {
    console.log(req.body);
    console.log("删除");
    req.user.remove().then(function (err) {
      res.status(204).json({});
    }).catch(function () {
      res.status(500).send(err);
    });
  });

module.exports = router;