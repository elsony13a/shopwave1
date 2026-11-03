import { useParams } from 'react-router-dom';
import OrderView from '../components/views/OrderView.jsx';

export default function OrderPage() {
  const { id } = useParams();
  return <OrderView id={id} />;
}
