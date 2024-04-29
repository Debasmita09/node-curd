const express = require("express");
const router = express.Router();
const user = require("./models/user");
const multer = require("multer");
const fs = require("fs");

//image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

//insert an usrer into database route
router.post("/addPost", upload, (req, res) => {
  console.log('huhgkudhgldh ', req.file);

  const newUser = new user({
    name: req.body.phone,
    image: req.file.filename,
  });

  newUser.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "user added successfully!",
      };
      res.redirect("/");
    }
  });
});


//getr all users route
router.get("/", (req, res) => {
  user.find().exec()
    .then(users => {
      res.render("index", {
        title: "Home page",
        users: users,
      });
    })
    .catch(err => {
      res.json({ message: err.message });
    });
});


router.get("/add", (req, res) => {
  res.render("add_user", { title: "Add Users" });
});

//edit an user route
router.get("/edit/id", (req, res) => {
  let id = res.params.id;
  user.findById(id, (err, user) => {
    if (err) {
      res.redirect("/");
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("edit_users", {
          title: "Edit user",
          user: user,
        });
      }
    }
  });
});

//update user route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlikesync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  user.findByIdAndupdate(
    id,
    {
      name: req.boby.name,
      email: req.boby.email,
      phone: req.body.phone,
      image: new_image,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "User updated successfully!",
        };
        res.redirect("/");
      }
    }
  );
});

//delete user route
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  user.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlikeSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "User deleted successfully!",
      };

      res.redirect("/");
    }
  });
});

module.exports = router;
