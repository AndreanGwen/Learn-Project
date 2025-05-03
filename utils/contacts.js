// pemanggilan modul
const fs = require("fs");
const { stringify } = require("querystring");

// membuat folder/directory
if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

// membuat file didalam directory
if (!fs.existsSync("data/contacts.json")) {
  fs.writeFileSync("data/contacts.json", "[]", "utf-8");
}

// fungsi isi file
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// fungsi mengisi detail
const findContact = (nama) => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf8");
  const contacts = JSON.parse(fileBuffer);
  const contact = contacts.find(
    (element) => nama.toLowerCase() === element.nama.toLowerCase()
  );

  return contact;
};

// fungsi mengecek duplikat nama
const cekDuplikat = (nama) => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf8");
  const dataLama = JSON.parse(fileBuffer);
  const cekDuplikatNama = dataLama.find((contact) => {
    return contact.nama === nama;
  });

  return cekDuplikatNama;
};

// fungsi untuk mengirim data masuk ke database
const sendDataContact = (data) => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf8");
  const dataLama = JSON.parse(fileBuffer);
  const dataBaru = data;
  dataLama.push(dataBaru);
  fs.writeFileSync("data/contacts.json", JSON.stringify(dataLama));
};

// fungsi delete contact
const deleteContact = (nama) => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf8");
  const dataLama = JSON.parse(fileBuffer);
  const dataBaru = dataLama.filter((contact) => contact.nama !== nama);

  fs.writeFileSync("data/contacts.json", JSON.stringify(dataBaru));
  console.log(dataBaru);
};

// fungsi update contact
const updateContact = (contactBaru) => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf8");
  const dataLama = JSON.parse(fileBuffer);
  const filteredDataLama = dataLama.filter(
    (contact) => contact.nama !== contactBaru.oldname
  );

  console.log(contactBaru);

  filteredDataLama.push(contactBaru);
  fs.writeFileSync("data/contacts.json", JSON.stringify(filteredDataLama));
};

module.exports = {
  loadContact: loadContact,
  findContact: findContact,
  sendDataContact: sendDataContact,
  cekDuplikat: cekDuplikat,
  deleteContact: deleteContact,
  updateContact: updateContact,
};
