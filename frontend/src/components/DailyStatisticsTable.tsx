import { useQuery } from "@tanstack/react-query";

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

const Header = (props: {columns: Array<Column>}) => {
  return (
    <thead>
      <tr>
        {props.columns.map((column) => (
          <th key={column.key}>{column.label}</th>
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

  const { isPending, error, data } = useQuery<DailyStatisticsArray>({
    queryKey: ['dailyStatistics'],
    queryFn: () => fetch('http://localhost:3000/api/dailystatistics')
      .then((res) => res.json()),
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  console.log(data);

  return (
    <div>
      <table>
        <Header columns={columns}/>
        <Content entries={data} columns={columns}/>
      </table>
    </div>
  );
}

export default DailyStatisticsTable;