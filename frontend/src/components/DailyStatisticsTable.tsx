import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface DailyStatistics {
    date: string | null;
    total_production_amount: number | null;
    total_consumption_amount: number | null;
    avg_hourly_price: number | null;
    max_negative_price_streak_hours: number | null;
}

type DailyStatisticsArray = DailyStatistics[];

interface Column {
  label: string;
  key: keyof DailyStatistics;
}

const columns: Array<Column> = [
  {label: "Date", key: "date"},
  {label: "Total production amount", key: "total_production_amount"},
  {label: "Total consumption amount", key: "total_consumption_amount"},
  {label: "Avg hourly price", key: "avg_hourly_price"},
  {label: "Max negative price streak in hours", key: "max_negative_price_streak_hours"},
];

interface Sorting {
  column: keyof DailyStatistics
  order: "asc" | "desc"
}

interface SortTable {
  (newSorting: Sorting): void
}

const HeaderCell = ({ column, sorting, sortTable }: { column: Column, sorting: Sorting, sortTable: SortTable }) => {
  const isDescSorting = sorting.column === column.key && sorting.order === "desc";
  const isAscSorting = sorting.column === column.key && sorting.order === "asc";
  const futureSortingOrder = isDescSorting ? "asc" : "desc";
  return (
    <th key={column.key} onClick={() => sortTable({column: column.key, order: futureSortingOrder})}>
      {column.label}
      {isDescSorting && <span> ▽</span>}
      {isAscSorting && <span> △</span>}
    </th>
  )
}

const Header = ({ columns, sorting, sortTable }: {columns: Array<Column>, sorting: Sorting, sortTable: SortTable}) => {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <HeaderCell column={column} sorting={sorting} sortTable={sortTable}/>
        ))}
      </tr>
    </thead>
  );
};

const Content = (props: {entries: DailyStatisticsArray, columns: Array<Column>}) => {
  return (
    <tbody>
      {props.entries.map((entry) => (
        <tr key={entry.date}>
          {columns.map((column) => (
            <td key={column.key}>{entry[column.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const DailyStatisticsTable = () => {
  const [sorting, setSorting] = useState<Sorting>({ column: "date", order: "asc"});

  const sortTable: SortTable = (newSorting: Sorting): void => {
    setSorting(newSorting);
  };

  const { isPending, error, data } = useQuery<DailyStatisticsArray>({
    queryKey: ['dailyStatistics', sorting],
    queryFn: () => fetch(`http://localhost:3000/api/dailystatistics?sort_by=${sorting.column}&order=${sorting.order}`)
      .then((res) => res.json()),
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <table>
        <Header columns={columns} sorting={sorting} sortTable={sortTable}/>
        <Content entries={data} columns={columns}/>
      </table>
    </div>
  );
}

export default DailyStatisticsTable;