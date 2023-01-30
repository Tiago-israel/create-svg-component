const fs = require("fs");

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

fs.readdir("../assets/", (error, files) => {
  if (error) throw err;

  files.forEach((value) => {
    const fileName = value.replace(".svg", "");
    fs.readFile(`../assets/${fileName}.svg`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const svg = data
        .replaceAll("<g", "<G")
        .replaceAll("</g", "</G")
        .replaceAll("<p", "<P")
        .replaceAll("</p", "</P")
        .replace("</svg>", "")
        .replace(/<\s*svg[^>]*>(.*?)/, "");

      const componentName = toPascalCase(fileName);
      const component = `
          import React from 'react';
          import { Path, G } from 'react-native-svg';
      
          export function ${componentName}(props){
              return (
                  <>
                      ${svg}
                  </>    
              )
          }
        `;

      fs.writeFile(
        `../build/${componentName}.tsx`,
        component,
        function (error) {
          if (error) throw err;
          console.log("File is created successfully.");
        }
      );
    });
  });
});
