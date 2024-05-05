const express = require("express");
const router = express.Router();
const user = require("./models/user");
//const multer = require("multer");
const fs = require("fs");

// router.get("/users", (req.res, res) => {
//   res.send("All Users");
// })

//image upload
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//   },
// });

// var upload = multer({
//   storage: storage,
// }).single("image");

//insert an usrer into database route
// router.post("/addPost", upload, (req, res) => {
//   console.log("huhgkudhgldh ", req.body);

//   const newUser = new user({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     // image: req.file.filename,
//   });

//   newUser.save((err) => {
//     if (err) {
//       res.json({ message: err.message, type: "danger" });
//     } else {
//       req.session.message = {
//         type: "success",
//         message: "user added successfully!",
//       };
//       res.redirect("/");
//     }
//   });
// });

router.post("/addPost",  async (req, res) => {
  console.log("huhgkudhgldh ", req.body);

  const newUser = new user({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    // image: req.file.filename,
  });

  try {
    await newUser.save();
    req.session.message = {
      type: "success",
      message: "user added successfully!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});
//getr all users route
router.get("/", (req, res) => {
  user
    .find()
    .exec()
    .then((users) => {
      res.render("index", {
        title: "Home page",
        users: users,
      });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

router.get("/add", (req, res) => {
  res.render("add_user", { title: "Add Users" });
});

//edit an user route
// router.get("/edit/:id", (req, res) => {
//   let id = req.params.id;
//   user.findById(id, (err, user) => {
//     if (err) {
//       res.redirect("/");
//     } else {
//       if (user == null) {
//         res.redirect("/");
//       } else {
//         console.log(user, "jghjhh");
//         res.render("edit_user", {
//           title: "Edit user",
//           user: user,
//         });
//       }
//     }
//   });
// });

router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let User = await user.findById(id); // Note the uppercase 'User' to match your model
    if (User === null) {
      res.redirect("/");
    } else {
      res.render("edit_user", {
        title: "Edit user",
        user: User,
      });
    }
  } catch (err) {
    console.log("error", err);
    res.redirect("/");
  }
});


//update user route
router.post("/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let new_image = "";

    // if (req.file) {
    //   new_image = req.file.filename;
    //   // try {
    //   //   fs.unlikesync("./uploads/" + req.body.old_image);
    //   // } catch (err) {
    //   //   console.log(err);
    //   // }
    // } else {
    //   new_image = req.body.old_image;
    // }

    await user.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      // image: new_image,
    });

    req.session.message = {
      type: "success",
      message: "User updated successfully!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});


//delete user route
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await user.findByIdAndDelete(id);
    // console.log( "result" + result);

    // if (result.image != "") {
    //   try {
    //     fs.unlinkSync("./uploads/" + result.image); // Corrected "unlikeSync" to "unlinkSync"
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    req.session.message = {
      type: "info",
      message: "User deleted successfully!",
    };

    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message });
  }
});


module.exports = router;
