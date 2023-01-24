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

  class Table<Type extends RowData> {
      public htmlElement: HTMLTableElement;

      private props: TableProps<Type>;

      private tbody: HTMLTableSectionElement;

      private thead: HTMLTableSectionElement;

      public constructor(props: TableProps<Type>) {
        this.props = props;
        this.checkColumnsCompatability();

        this.htmlElement = document.createElement('table');
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');

        this.initialize();
  }

  private checkColumnsCompatability = (): void => {
    const { rowsData, columns } = this.props;

    if (this.props.rowsData.length === 0) return;
    const columnCount = countObjectProperties(columns);

    const columnsCompatableWithRowsData = rowsData.every((row) => {
      const rowCellsCount = countObjectProperties(row);

      return rowCellsCount === columnCount;
    });

    if (!columnsCompatableWithRowsData) {
      throw new Error('Nesutampa lentelės stulpelių skaičius su eilučių stulpelių skaičiumi');
    }
  };

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
