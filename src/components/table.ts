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
  }