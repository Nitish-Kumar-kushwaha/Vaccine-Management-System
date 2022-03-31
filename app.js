const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//require("./config/db");
const session = require("express-session");
const passport = require("passport");

const { isLoggedIn } = require("./middleware");

// models export
const User = require("./models/user");
const CentreDetails = require("./models/centre");
const Applicant = require("./models/Applicants");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "our secret is .",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//passport local staergy
passport.use(User.createStrategy());

//to use with
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect("mongodb://localhost:27017/vcm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log("err");
  });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// confirmation
app.get("/confor", (req, res) => {
  res.render("confiramation");
});

//sucess
app.get("/sucess", (req, res) => {
  res.render("sucess");
});

// to register the user

app.post("/register", async (req, res) => {
  try {
    const user = {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      mobileNumber: req.body.mobile_number,
      username: req.body.username,
    };
    console.log(user);
    const newUser = await User.register(user, req.body.password);
    console.log(newUser);

    // const findd = await User.find({ username: req.body.username }, (err) => {
    //   if (err) return console.error(err);
    //   else{
    //     res.send
    //   }
    // });

    // console.log(findd);

    res.status(200).redirect("/confor");
  } catch (e) {
    console.log(e);
  }
});
// practise

app.get("/rashu", async (req, res) => {
  const findu = User.find({ username: anshu123 }, "username", (err, result) => {
    if (!err) {
      res.json(result);
      console.log(result);
    }
  });
  console.log(findu);
});
// to login

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/main");
  }
);

//Main package
app.get("/main", isLoggedIn, (req, res) => {
  CentreDetails.find({}, (err, result) => {
    if (!err) {
      res.render("main", { result: result, message: "Type above to search" });
      // res.json(result);
    }
  });
});

app.post("/main", (req, res) => {
  CentreDetails.find({}, (err, result) => {
    if (!err) {
      CentreDetails.find(
        { centreName: req.body.centreName },
        (err, result1) => {
          if (!err) {
            if (result1.length > 0)
              res.render("main", {
                result: result,
                searchResult: result1[0],
                message: "",
              });
            else
              res.render("main", {
                result: result,
                message: "No result found",
              });
          }
        }
      );
    }
  });
});

app.post("/search", function (req, res) {
  let centre_Name = req.body.centreName;
  CentreDetails.find({ centreName: req.body.centreName }, (err, result1) => {
    if (!err) {
      console.log(centre_Name);
      console.log("not facing error");
      console.log(result1);
      res.render("main", { result1 });
      res.redirect("/main");
    }
  });
});

//proceed

app.get("/proceed", isLoggedIn, (req, res) => {
  res.render("proceed");
});

app.post("/proceed", async (req, res) => {
  try {
    let new_applicant = new Applicant({
      applicantName: req.body.applicantAame,
      date: req.body.date_of_dose,
      vaccine: req.body.vaccinesName,
      dose: req.body.dose,
      time: req.body.time,
    });
    await new_applicant.save((err, book) => {
      if (err) {
        console.log(err);
      } else {
        console.log(book);

        res.redirect("/sucess");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

//Logout

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("port 3000 is running");
});
