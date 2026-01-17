import { useQuery } from "@tanstack/react-query";

interface DailyStatistics {
    date: string | null;
    total_production_amount: number | null;
    total_consumption_amount: number | null;
    avg_hourly_price: number | null;
    max_negative_price_streak_hours: number | null;
}

type DailyStatisticsArray = DailyStatistics[];

const columns: Array<string> = [
  "Date",
  "Total production amount",
  "Total consumption amount",
  "Avg hourly price",
  "Max negative price streak in hours"
];

const entrykeys: Array<keyof DailyStatistics> = [
  "date",
  "total_production_amount",
  "total_consumption_amount",
  "avg_hourly_price",
  "max_negative_price_streak_hours"
]

const Header = (props: {columns: Array<string>}) => {
  return (
    <thead>
      <tr>
        {props.columns.map((column) => (
          <th key={column}>{column}</th>
        ))}
      </tr>
    </thead>
  );
};

const Content = (props: {entries: DailyStatisticsArray, entrykeys: Array<keyof DailyStatistics>}) => {
  return (
    <tbody>
      {props.entries.map((entry) => (
        <tr key={entry.date}>
          {entrykeys.map((entrykey) => (
            <td key={entrykey}>{entry[entrykey]}</td>
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
        <Content entries={data} entrykeys={entrykeys}/>
      </table>
    </div>
  );
}

export default DailyStatisticsTable;