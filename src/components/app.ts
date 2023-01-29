import Table from './table';
import brands from '../data/brands';
import models from '../data/models';
import cars from '../data/cars';
import CarsCollection, { CarProps } from '../helpers/cars-collection';
import CarForm, { Values } from './car-form';
import stringifyProps, { StringifyObjectProps } from '../helpers/stingify-object';
import SelectField from './select-field';
import type CarJoined from '../types/car-joined';

const ALL_BRAND_ID = '-1' as const;
const ALL_CAR_TITLE = 'Visi automobiliai' as const;
const ALL_BRAND_TITLE = 'Markė' as const;
const initialBrandId = brands[0].id;

class App {
  private carsCollection: CarsCollection;

  private editedCarId: string | null;

  private selectedBrandId: string | null;

  private brandSelect: SelectField;

  private carForm: CarForm;

  private carTable: Table<StringifyObjectProps<CarJoined>>;

  private htmlElement: HTMLElement;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    this.carsCollection = new CarsCollection({ cars, brands, models });

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.selectedBrandId = null;
    this.editedCarId = null;
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
      editedCarId: this.editedCarId,
    });

    this.brandSelect = new SelectField({
      labelText: ALL_BRAND_TITLE,
      options: [
        { title: ALL_CAR_TITLE, value: ALL_BRAND_ID },
        ...brands.map(({ id, title }) => ({ title, value: id })),
      ],
      onChange: this.handleBrandChange,
    });

    this.carForm = new CarForm({
      title: 'Sukurti naują automobilį',
      values: {
        brand: initialBrandId,
        model: models.filter((m) => m.brandId === initialBrandId)[0].id,
        price: '0',
        year: '0000',
      },
      submitBtnText: 'Sukurti',
      onSubmit: this.handleCarCreate,
      status: 'create',
    });
  }

  private handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    this.selectedBrandId = brand ? brandId : null;
    this.editedCarId = null;

    this.update();
  };

  private handleCarDelete = (carId: string): void => {
    this.carsCollection.deleteCarById(carId);
    this.editedCarId = null;

    this.update();
  };

  private handleCarEdit = (brandId: string): void => {
    this.editedCarId = brandId === this.editedCarId ? null : brandId;

    this.update();
  };

  private handleCarCreate = ({
    brand,
    model,
    price,
    year,
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

  private handleCarUpdate = ({
    brand,
    model,
    price,
    year,
  }: Values): void => {
    if (this.editedCarId) {
      const carProps: CarProps = {
        brandId: brand,
        modelId: model,
        price: Number(price),
        year: Number(year),
      };

      this.carsCollection.carUpdate(this.editedCarId, carProps);
      this.editedCarId = null;

      this.update();
    }
  };

  private update = (): void => {
    const { selectedBrandId, carsCollection, editedCarId } = this;

    if (selectedBrandId === null) {
      this.carTable.updateProps({
        title: ALL_CAR_TITLE,
        rowsData: carsCollection.all.map(stringifyProps),
        editedCarId,
      });
    } else {
      const brand = brands.find((newBrand) => newBrand.id === selectedBrandId);
      if (brand === undefined) throw new Error('Pasirinkta neegzistuojanti markė');

      this.carTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: carsCollection.getByBrandId(selectedBrandId).map(stringifyProps),
        editedCarId,
      });
    }
    if (editedCarId) {
      const editedCar = cars.find((newCar) => newCar.id === editedCarId);
      if (!editedCar) {
        alert(`Klaida! nėra tokios mašinos ${editedCarId}`);
        return;
      }
      const model = models.find((newModel) => newModel.id === editedCar.modelId);
      if (!model) {
        alert(`Klaida! nėra tokios mašinos su ${model}`);
        return;
      }

      this.carForm.updateProps({
        title: 'Redaguoti automobilį',
        submitBtnText: 'Redaguoti',
        values: {
          brand: model.brandId,
          model: model.id,
          price: String(editedCar.price),
          year: String(editedCar.year),
        },
        status: 'update',
        onSubmit: this.handleCarUpdate,
      });
    } else {
      this.carForm.updateProps({
        title: 'Sukurti naują automobilį',
        submitBtnText: 'Sukurti',
        values: {
          brand: initialBrandId,
          model: models.filter((m) => m.brandId === initialBrandId)[0].id,
          price: '0',
          year: '0000',
        },
        status: 'create',
        onSubmit: this.handleCarCreate,
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
