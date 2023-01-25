import CarsCollection from '../helpers/cars-collection';
import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import Table from './table';
import stringifyProps from '../helpers/stingify-object';
import SelectField from './select-field';

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  private brandSelect: SelectField;

  constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    this.carsCollection = new CarsCollection({ cars, brands, models });

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.htmlElement = foundElement;

    this.brandSelect = new SelectField({
      labelText: 'Markė',
      options: brands.map(({ id, title }) => ({ title, value: id })),
    });
  }

  initialize = (): void => {
    const carTable = new Table({
      title: 'Visi automobiliai',
      columns: {
        id: 'Id',
        brand: 'Markė',
        model: 'Modelis',
        price: 'Kaina',
        year: 'Metai',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
    });

    const container = document.createElement('div');
    container.className = 'container container my-4 d-flex  flex-column gap-3';
    container.append(
      this.brandSelect.htmlElement,
      carTable.htmlElement,
);

    this.htmlElement.append(container);
  };
}
  export default App;
