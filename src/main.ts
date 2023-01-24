import App from './components/app';
import cars from './data/cars';
import brands from './data/brands';
import models from './data/models';
import CarsCollection from './helpers/cars-collection';

const app = new App('#root');
app.initialize();

const carsCollection = new CarsCollection({
    cars,
    brands,
    models,
});

console.table(carsCollection.all);
