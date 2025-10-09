// Load environment variables
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const dbUrl=process.env.ATLASDB_URL;


const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const fs = require('fs');
const csv = require('csv-parser');

// ----- Create Express app -----

// ----- LiveReload setup -----
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
liveReloadServer.watch(path.join(__dirname, 'views'));
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("express-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const Listing = require("./models/resource.js");

const resourceRouter = require("./routes/resource.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const { testSMTP } = require("./smtp-test");

app.get("/test-smtp", async (req, res) => {
  try {
    await testSMTP();
    res.send("✅ SMTP connection successful");
  } catch (err) {
    res.send("❌ SMTP connection failed: " + err.message);
  }
});

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


let hospitals = [
  { name: 'Fortis Hospital', beds: 20, oxygen: 12, doctors: 8 },
  { name: 'KEM Hospital', beds: 5, oxygen: 4, doctors: 3 },
  { name: 'Apollo Hospital', beds: 15, oxygen: 8, doctors: 6 },
];

let supplies = [
  { name: 'Oxygen Cylinder', quantity: 50 },
  { name: 'Beds', quantity: 30 },
  { name: 'Blood Units', quantity: 20 },
  { name: 'Paracetamol', quantity: 200 },
];

let admissions = [];      // Patients admitted via /admission form
let patientsLocal = [];   // Patients loaded from CSV or added via /patients page

// Temporary in-memory user for demo
const users = [
  { username: 'admin', password: 'admin123' } // In real app, hash passwords!
];

// ----- Load patients from CSV for Patient Management -----
const csvFilePath = path.join(__dirname, 'data', 'patients.csv');
if (fs.existsSync(csvFilePath)) {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Ensure numeric fields are numbers
      row.age = Number(row.age) || 0;
      row.beds = Number(row.beds) || 0;
      // Generate appointment_id if missing
      if (!row.appointment_id) {
        row.appointment_id = `A${patientsLocal.length + 1}`;
      }
      patientsLocal.push(row);
    })
    .on('end', () => {
      console.log('Patients CSV file successfully loaded');
    });
}

// ----- Routes -----

// Home page
app.get('/', (req, res) => {
  res.render('index', { title: 'MediTrack Home' });
});

// Dashboard
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', hospitals });
});

// ----- Admission Routes -----
app.get('/admission', (req, res) => {
  res.render('admission', { title: 'Patient Admission', patients: admissions, error: null });
});

app.post('/admission', (req, res) => {
  const { name, age, requiredBeds } = req.body;
  const bedsRequired = Number(requiredBeds);
  const patientAge = Number(age);

  // Find a hospital with enough beds
  const hospital = hospitals.find(h => h.beds >= bedsRequired);

  if (hospital) {
    hospital.beds -= bedsRequired; // allocate beds
    const patient = {
      name,
      age: patientAge,
      hospital: hospital.name,
      beds: bedsRequired
    };
    admissions.push(patient);
    res.redirect('/admission');
  } else {
    res.render('admission', { title: 'Patient Admission', patients: admissions, error: 'No hospital has enough beds' });
  }
});

// ----- Supply Routes -----
app.get('/supply', (req, res) => {
  res.render('supply', { title: 'Supply', supplies, error: null });
});

// ----- Login Routes -----
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.redirect('/dashboard');
  } else {
    res.render('login', { title: 'Login', error: 'Invalid username or password' });
  }
});

// ----- Patient Management Routes -----
app.get('/patients', (req, res) => {
  res.render('patients', { title: 'Patient Management', patients: patientsLocal, error: null });
});

app.post('/patients/add', (req, res) => {
  const newPatient = req.body;

  // Generate appointment_id if missing
  if (!newPatient.appointment_id) {
    newPatient.appointment_id = `A${patientsLocal.length + 1}`;
  }

  newPatient.age = Number(newPatient.age) || 0;
  newPatient.beds = Number(newPatient.beds) || 0;

  patientsLocal.push(newPatient);
  res.redirect('/patients');
});

app.post('/patients/delete', (req, res) => {
  const { appointment_id } = req.body;
  patientsLocal = patientsLocal.filter(p => p.appointment_id !== appointment_id);
  res.redirect('/patients');
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Global middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/", resourceRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    console.log(err);
});


//Connecting to the database

async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

const port = 8080;
app.listen(port, () => {
    console.log(`Listening to port ${port} `);
});
