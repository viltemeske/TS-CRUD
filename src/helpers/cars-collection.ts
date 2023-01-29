import Car from '../types/car';
import Model from '../types/model';
import Brand from '../types/brand';
import CarJoined from '../types/car-joined';

type CarsCollectionProps = {
  cars: Car[],
  brands: Brand[],
  models: Model[],
};

export type CarProps = {
  brandId: string,
  modelId: string,
  price: number,
  year: number
};
export type CreateCarProps = Omit<Car, 'id'> & { brandId: string };

const createId = (): string => String(Math.floor(Math.random() * 100000000000000));

class CarsCollection {
  private props: CarsCollectionProps;

  constructor(props: CarsCollectionProps) {
    this.props = props;
  }

  private joinCar = ({ modelId, ...car }: Car) => {
    const { brands, models } = this.props;
    const carModel = models.find((model) => model.id === modelId);
    const carBrand = brands.find((brand) => brand.id === carModel?.brandId);

    return {
      ...car,
      brand: (carBrand && carBrand.title) ?? 'unknown',
      model: (carModel && carModel.title) ?? 'unknown',
    };
  };

  public get all(): CarJoined[] {
    return this.props.cars.map(this.joinCar);
  }

  public getByBrandId = (brandId: string): CarJoined[] => {
    const { cars, models } = this.props;

    const brandModelsIds = models
      .filter((model) => model.brandId === brandId)
      .map((model) => model.id);
    return cars
      .filter((car) => brandModelsIds.includes(car.modelId))
      .map(this.joinCar);
  };

  public deleteCarById = (carId: string): void => {
    this.props.cars = this.props.cars.filter((car) => car.id !== carId);
  };

  public add = ({ modelId, brandId, ...carProps }: CarProps): void => {
    const { models, brands, cars } = this.props;
    const model = models.find((m) => m.id === modelId);
    const brand = brands.find((b) => b.id === brandId);

    if (!model || !brand) {
      throw new Error('Netinkami duomenys sukurti automobilį');
    }

    const newCar: Car = {
      id: createId(),
      ...carProps,
      modelId,
    };

    cars.push(newCar);
  };

  public carUpdate = (carId: string, { brandId, modelId, ...carProps }: CreateCarProps) => {
    const updatedCarIndex = this.props.cars.findIndex((car) => car.id === carId);
    if (updatedCarIndex === -1) {
      throw new Error(`Automobilis su id: "${carId}" buvo nerastas`);
    }

    const model = this.props.models.find((models) => models.id === modelId);
    if (!model) {
      throw new Error(`Automobilis su id: "${modelId}" buvo nerastas`);
    }

    const brand = this.props.brands.find((brands) => brands.id === brandId);
    if (!brand) {
      throw new Error(`Automobilis su id: "${modelId}" buvo nerastas`);
    }

    const updateCar: Car = {
      ...this.props.cars[updatedCarIndex],
      ...carProps,
      modelId,
    };

    this.props.cars.splice(updatedCarIndex, 1, updateCar);
  };
}

export default CarsCollection;
