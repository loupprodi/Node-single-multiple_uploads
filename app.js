const { throws } = require("assert");
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  })
);

app.get("/", async (req, res, next) => {
  res.render("index");
});

app.post("/single", async (req, res, next) => {
  try {
    const file = req.files.mFile;
    console.log(file);
    //Abaixo um codigo feito para passar o nome atual com base na data de upload e na extensão do nome
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    // const savePath = path.join(__dirname, "public", "uploads", file.name);
    const savePath = path.join(__dirname, "public", "uploads", fileName);
    //mv metodo do middleware aplicando metodo no file e passando o caminho relativo fileUpload()
    if (file.truncated) {
      throw new Error("File size is bigger");
    }
    if (file.mimetype !== "image/jpeg") {
      throw new Error("Only jpegs are supported");
    }
    await file.mv(savePath);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Error Uploading file");
  }
});

app.post("/multiple", async (req, res, next) => {
  try {
    const files = req.files.mFiles;

    // maneira errada de se subir um multiple file arquivo
    // files.forEach(file =>{
    //   const savePath = path.join(__dirname, 'public', 'uploads', file.name)
    //   await file.mv(savePath)
    // })

    // maneira de se fazer, mas ainda nao correta

    // let promises = [];
    // files.forEach((file) => {
    //   const savePath = path.join(__dirname, "public", "uploads", file.name);
    //   promises.push(file.mv(savePath));
    // });

    // maneira melhorada

    const promises = files.map((file) => {
      const savePath = path.join(__dirname, "public", "uploads", file.name);
      return file.mv(savePath);
    });

    await Promise.all(promises);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Error Uploading files....");
  }
});

app.listen(3000, () => console.log("Server on port 3000"));
