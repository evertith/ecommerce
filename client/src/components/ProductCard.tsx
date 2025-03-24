import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const ProductCard = ({ id, name, price, image, description }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-[250px] bg-gray-100">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/products/${id}`} className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${price.toFixed(2)}</span>
          </div>
        </Link>
        <div className="mt-auto pt-4">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 