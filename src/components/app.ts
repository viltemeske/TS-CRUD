import Table from './table';

import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';

import CarsCollection from '../helpers/cars-collection';
import stringifyProps, { StringifyObjectProps } from '../helpers/stingify-object';

import SelectField from './select-field';

import type CarJoined from '../types/car-joined';

const ALL_CAR_TITLE = 'Visi automobiliai' as const;
const ALL_BRAND_TITLE = 'Markė' as const;

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  private selectedBrandId: null | string;

  private carTable: Table<StringifyObjectProps<CarJoined>>;

  private brandSelect: SelectField;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    this.carsCollection = new CarsCollection({ cars, brands, models });

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.htmlElement = foundElement;
    this.selectedBrandId = null;
    this.carTable = new Table({
      title: ALL_CAR_TITLE,
      columns: {
        id: 'Id',
        brand: ALL_BRAND_TITLE,
        model: 'Modelis',
        price: 'Kaina',
        year: 'Metai',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
      onDelete: this.handleCarDelete,
    });

    this.brandSelect = new SelectField({
      labelText: ALL_BRAND_TITLE,
      options: brands.map(({ id, title }) => ({ title, value: id })),
      onChange: this.handleBrandChange,
    });
    this.selectedBrandId = null;

    this.htmlElement = foundElement;

    this.initialize();
  }

  private handleBrandChange = (brandId: string): void => {
    this.selectedBrandId = brandId;

    this.update();
  };

  private update = (): void => {
    const { selectedBrandId, carsCollection } = this;

    if (selectedBrandId === null) {
      this.carTable.updateProps({
        title: ALL_CAR_TITLE,
        rowsData: carsCollection.all.map(stringifyProps),
      });
    } else {
      const brand = brands.find((carBrand) => carBrand.id === selectedBrandId);
      if (brand === undefined) throw new Error('Pasirinkta neegzistuojanti markė');

      this.carTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: carsCollection.getByBrandId(selectedBrandId).map(stringifyProps),
      });
    }
  };

  private handleCarDelete = (carId: string): void => {
    this.carsCollection.deleteCarById(carId);

    this.update();
  };

  public initialize = (): void => {
    const container = document.createElement('div');
    container.className = 'container my-4 d-flex  flex-column gap-3';
    container.append(
      this.brandSelect.htmlElement,
      this.carTable.htmlElement,
    );

    this.htmlElement.append(container);
  };
}

export default App;
