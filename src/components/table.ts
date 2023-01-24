import countObjectProperties from '../helpers/count-object-properties';

type RowData = {
    id: string,
    [key: string]: string,
  };

export type TableProps<Type> = {
    title: string,
    columns: Type,
    rowsData: Type[],
  };

  class Table {
      private props: TableProps;

      private tbody: HTMLTableSectionElement;

      private thead: HTMLTableSectionElement;

      public htmlElement: HTMLTableElement;

      public constructor(props: TableProps<Type>) {
        this.props = props;
        this.htmlElement = document.createElement('table');
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');

        this.initialize();
  }

  private initializeHead = (): void => {
    const { title, columns } = this.props;

    const headersArray = Object.values(columns);
    const headersRowHtmlString = headersArray.map((header) => `<th>${header}</th>`).join('');

    this.thead.innerHTML = `
      <tr>
        <th colspan="${headersArray.length}" class="text-center h3">${title}</th>
      </tr>
      <tr>${headersRowHtmlString}</tr>
    `;
  };
}
export default Table;
