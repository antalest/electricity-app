import './App.css';
import { useQuery } from '@tanstack/react-query';

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['dailyStatistics'],
    queryFn: () =>
      fetch('http://localhost:3000/api/dailystatistics').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>Electricity Daily Statistics</h1>
      <p>
        {data[0].date}{' '}
        {data[0].avg_production_amount}{' '}
        {data[0].avg_consumption_amount}{' '}
        {data[0].avg_hourly_price}{' '}
        {data[0].max_negative_price_streak_hours}{' '}
      </p>
    </div>
  )
};

export default App;
