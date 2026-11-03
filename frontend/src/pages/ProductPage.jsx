import { useParams } from 'react-router-dom';
import ProductDetailView from '../components/views/ProductDetailView.jsx';

export default function ProductPage() {
  const { id } = useParams();
  return <ProductDetailView id={id} />;
}
