/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import { join } from "node:path";
import { writeFile, readFile, createWriteStream } from "node:fs";
import { createPromptModule } from "inquirer";
import qr from "qr-image";

var currentDir = process.cwd();
var promptUser = createPromptModule();

promptUser({
  message: "Type in your URL: ",
  name: "URL",
}).then((answers) => {
  const url = answers.URL;

  // Save the user input to a txt file
  writeFile(join(currentDir, "data", "urls.txt"), `${url}\n`, { flag: "w" }, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  //   Create a QR code image from the user input
  readFile(join(currentDir, "data", "urls.txt"), "utf8", (err, data) => {
    if (err) throw err;
    var qr_svg = qr.image(data);
    qr_svg.pipe(createWriteStream(join(currentDir, "qr-image", "qr_img.png")));

    console.log("The QR code image has been saved!");
  });
});
