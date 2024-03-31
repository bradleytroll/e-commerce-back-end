const express = require('express');
const routes = require('./routes');
const sequalize = require('sequalize')


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  sequalize.sync({ force: false }).then(() => {
  console.log(`App listening on port ${PORT}!`);
  });

});
