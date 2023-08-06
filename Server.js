const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const loginRoutes = require('./controllers/homeRoutes'); // Corrected import statement
const path = require('path');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = require('./config/connection');
const app = express();

app.use(session({
  secret: 'super secret',
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: true,
}));

app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(loginRoutes); // Use the loginRoutes middleware before the "routes" middleware
app.use(routes);

const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
