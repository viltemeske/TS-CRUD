type TableProps<Type> = {
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

}