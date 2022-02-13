const fs = require("fs/promises");

/**********************************************
 * since the original Foxel metadata links to foxel.eth.link/foxel/:id
 * but pathing doesn't work through ipfs without hash routing so we
 * are adding an actual directory for each foxel that redirects the
 * hashed version of the link: foxel.eth.link/#/foxel/:id
 ************************************************/

for (let i = 1; i <= 3000; i++) {
  const html = `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>foxel.eth</title>
        <script>
            window.location.href = "https://foxel.eth.link/#/foxel/${i}"
        </script>
    </head>
    <body>
      <p>If you are not redirected automatically, <a href="https://foxel.eth.link/#/foxel/${i}">click here</a>.</p>
    </body>
  </html>`;

  fs.mkdir(`./${i}`)
    .then(() => {
      fs.writeFile(`./${i}/index.html`, html);
    })
    .catch(err => {
      console.error(err);
    });
}
