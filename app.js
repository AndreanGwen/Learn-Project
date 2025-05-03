// modul modul
const express = require("express");
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const {
  loadContact,
  findContact,
  sendDataContact,
  cekDuplikat,
  deleteContact,
  updateContact,
} = require("./utils/contacts");

// memberitahu express sekarang kita memakai view engine ejs
app.set("view engine", "ejs");

// third party middleware
app.use(expressLayouts);

// built in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash message
app.use(cookieParser("secret"));
app.use(
  expressSession({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

const mahasiswa = [
  {
    nama: "Andrean",
    email: "andreansatriya22@gmail.com",
  },
  {
    nama: "Satriya",
    email: "andrgwn@gmail.com",
  },
  {
    nama: "Gwen",
    email: "gwen@gmail.com",
  },
];

app.get("/", (req, res) => {
  res.render("index", {
    nama: "Satriya",
    mahasiswa: mahasiswa,
    title: "Halaman Home",
    layout: "layouts/main-layouts",
    cssFile: "css/index.css",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    nama: "ys",
    layout: "layouts/main-layouts",
    cssFile: "css/about.css",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layouts",
    cssFile: "css/contact.css",
    contacts: contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("form-contact", {
    title: "Form Contact Tambah Contact",
    layout: "layouts/main-layouts",
    cssFile: "css/form-contact.css",
    errors: [],
  });
});

app.post(
  "/contact", //path
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error(
          `Nama ${value} sudah terdaftar, silahkan gunakan nama lain!`
        );
      }
      return true;
    }),
    check("email", "Alamat email tidak valid!").isEmail(),
    check("nohp", "No. Handphone tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("form-contact", {
        title: "Form Contact Tambah Contact",
        layout: "layouts/main-layouts",
        cssFile: "css/form-contact.css",
        errors: errors.array(),
      });
    } else {
      sendDataContact(req.body);
      req.flash("msg", "Data contact baru berhasil ditambahkan.");
      res.redirect("/contact");
    }
  }
);

// delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send("404: Page not found!");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus!");
    res.redirect("/contact");
  }
});

// edit contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  contact.oldname = contact.nama;
  res.render("edit-contact", {
    title: "Form Edit Data Contact",
    layout: "layouts/main-layouts",
    cssFile: "css/edit-contact.css",
    errors: [],
    contact: contact,
  });
});

// halaman edit contact
app.post(
  "/contact/update", //path
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldname && duplikat) {
        throw new Error(
          `Nama ${value} sudah terdaftar, silahkan gunakan nama lain!`
        );
      }
      return true;
    }),
    check("email", "Alamat email tidak valid!").isEmail(),
    check("nohp", "No. Handphone tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Form Edit Data Contact",
        layout: "layouts/main-layouts",
        cssFile: "css/edit-contact.css",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);
      req.flash("msg", "Data contact berhasil diupdate!.");
      res.redirect("/contact");
    }
  }
);

// halaman detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    title: "Halaman Detail",
    layout: "layouts/main-layouts",
    cssFile: "css/detail.css",
    contact: contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404: Page not found!");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
