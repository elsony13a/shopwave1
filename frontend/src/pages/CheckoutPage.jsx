import { useNavigate } from 'react-router-dom';
import CheckoutView from '../components/views/CheckoutView.jsx';

export default function CheckoutPage() {
  const navigate = useNavigate();
  return <CheckoutView onSuccess={(order) => navigate(`/order/${order.id}`)} />;
}
