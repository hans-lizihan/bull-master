module.exports = (req, res) => {
  const baseUrl = req.proxyUrl || req.baseUrl;

  res.end(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <title>Bull Master</title>
  </head>
  <body>
    <div id="root">Loading...</div>
    <script>
      window.basePath = '${baseUrl}'
    </script>
    <script src="${baseUrl}/bundle.js"></script>
  </body>
</html>
`);
};
