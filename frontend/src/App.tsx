import './App.css';
import { useQuery } from '@tanstack/react-query';

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['dailyStatistics'],
    queryFn: () => fetch('http://localhost:3000/api/dailystatistics').then((res) => res.json()),
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  //Response model
  interface DailyStatistics {
    date: string | null;
    total_production_amount: number | null;
    total_consumption_amount: number | null;
    avg_hourly_price: number | null;
    max_negative_price_streak_hours: number | null;
  }

  const stats: DailyStatistics[] = data;

  return (
    <div>
      <h1>Electricity Daily Statistics</h1>
      <table>
        <tr key={'header'}>
          <th>Date</th>
          <th>Total consumption</th>
          <th>Total production</th>
          <th>Average hourly price</th>
          <th>Longest consecutive period when price was negative (hours)</th>
        </tr>
        {stats.map((item) => (
          <tr key={item.date}>
            {Object.values(item).map((val) => (
              <td>{val}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
