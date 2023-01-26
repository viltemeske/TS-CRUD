import TextField from './text-field';
import SelectField from './select-field';
import brands from '../data/brands';
import models from '../data/models';

export type Values = {
    brand: string,
    model: string,
    price: string,
    year: string,
  };

  type CarFormProps = {
    values: Values,
    title: string,
    submitBtnText: string,
    onSubmit: (values: Values) => void,
  };

type Fields = {
    brand: SelectField,
    model: SelectField,
    price: TextField,
    year: TextField,
  };

  class CarForm {
    public htmlElement: HTMLFormElement;

    private props: CarFormProps;

    private fields: Fields;

    private htmlFormHeader: HTMLHeadingElement;

    private htmlFieldsContainer: HTMLDivElement;

    private htmlSubmitBtn: HTMLButtonElement;

    constructor (props:CarFormProps ) {
        this.props = props;
        this.htmlElement = document.createElement('form');
        this.htmlFormHeader = document.createElement('h2');
        this.htmlFieldsContainer = document.createElement('div');
        this.htmlSubmitBtn = document.createElement('button');
        this.fields = {
             brand: new SelectField({
                name: 'brand',
                labelText: 'Markė',
                options: brands.map(({ id, title }) => ({ title, value: id })),
              }),
              model: new SelectField({
                name: 'model',
                labelText: 'Modelis',
                options: models.map(({ id, title }) => ({ title, value: id })),
              }),
              price: new TextField({
                name: 'price',
                labelText: 'Kaina',
              }),
              year: new TextField({
                name: 'year',
                labelText: 'Metai',
              }),
            };
    

        }

    }
    export default CarForm;
  