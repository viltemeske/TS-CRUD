import Table from './table';
import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import CarsCollection, { CarProps } from '../helpers/cars-collection';
import stringifyProps, { StringifyObjectProps } from '../helpers/stingify-object';
import SelectField from './select-field';
import type CarJoined from '../types/car-joined';
import CarForm, { Values } from './car-form';

const ALL_BRAND_ID = '-1' as const;
const ALL_CAR_TITLE = 'Visi automobiliai' as const;
const ALL_BRAND_TITLE = 'Markė' as const;

class App {
  private htmlElement: HTMLElement;

  private editedBrandId: string | null;

  private carsCollection: CarsCollection;

  private selectedBrandId: null | string;

  private carTable: Table<StringifyObjectProps<CarJoined>>;

  private carForm: CarForm;

  private brandSelect: SelectField;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    this.carsCollection = new CarsCollection({ cars, brands, models });

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.selectedBrandId = null;
    this.editedBrandId = null;
    this.htmlElement = foundElement;
    this.carTable = new Table({
      title: ALL_CAR_TITLE,
      columns: {
        brand: ALL_BRAND_TITLE,
        model: 'Modelis',
        price: 'Kaina',
        year: 'Metai',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
      onDelete: this.handleCarDelete,
      onEdit: this.handleCarEdit,
      editedBrandId: this.editedBrandId,
    });

    this.brandSelect = new SelectField({
      labelText: ALL_BRAND_TITLE,
      options: [
        { title: ALL_CAR_TITLE, value: ALL_BRAND_ID },
        ...brands.map(({ id, title }) => ({ title, value: id })),
      ],
      onChange: this.handleBrandChange,
    });

    const initialBrandId = brands[0].id;
    this.carForm = new CarForm({
      title: 'Sukurti naują automobilį',
      values: {
        brand: initialBrandId,
        model: models.filter((m) => m.brandId === initialBrandId)[0].id,
        price: '0',
        year: '0000',
      },
      submitBtnText: 'Sukurti',
      onSubmit: this.handleCreateCar,
      status: 'create',
    });
  }

  private handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    this.selectedBrandId = brand ? brandId : null;

    this.update();
  };

  private handleCarDelete = (carId: string): void => {
    this.carsCollection.deleteCarById(carId);

    this.update();
  };

  private handleCarEdit = (brandId: string): void => {
    this.editedBrandId = brandId === this.editedBrandId ? null : brandId;

    this.update();
  };

  private handleCreateCar = ({
    brand, model, price, year,
  }: Values): void => {
    const carProps: CarProps = {
      brandId: brand,
      modelId: model,
      price: Number(price),
      year: Number(year),
    };

    this.carsCollection.add(carProps);

    this.update();
  };

  private update = (): void => {
    const { selectedBrandId, carsCollection } = this;

    if (selectedBrandId === null) {
      this.carTable.updateProps({
        title: ALL_CAR_TITLE,
        rowsData: carsCollection.all.map(stringifyProps),
        editedBrandId: this.editedBrandId,
      });
    } else {
      const brand = brands.find((carBrand) => carBrand.id === selectedBrandId);
      if (brand === undefined) throw new Error('Pasirinkta neegzistuojanti markė');

      this.carTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: carsCollection.getByBrandId(selectedBrandId).map(stringifyProps),
        editedBrandId: this.editedBrandId,
      });
    }
    if (this.editedBrandId === null) {
      this.carForm.updateProps({
        title: 'Sukurti naują automobilį',
        submitBtnText: 'Sukurti',
        status: 'create',
      });
    } else {
      this.carForm.updateProps({
        title: 'Automobilio redagavimas',
        submitBtnText: 'Atnaujinti',
        status: 'update',
      });
    }
  };

  public initialize = (): void => {
    const uxContainer = document.createElement('div');
    uxContainer.className = 'd-flex gap-4 align-items-start';
    uxContainer.append(
      this.carTable.htmlElement,
      this.carForm.htmlElement,
    );

    const container = document.createElement('div');
    container.className = 'container my-4 d-flex flex-column gap-4';
    container.append(
      this.brandSelect.htmlElement,
      uxContainer,
    );

    this.htmlElement.append(container);
  };
}

export default App;
