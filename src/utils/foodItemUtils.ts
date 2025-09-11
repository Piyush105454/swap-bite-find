
import { formatDistanceToNow } from 'date-fns';

interface FoodItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  location_lat: number;
  location_lng: number;
  location_address: string;
  user_id: string;
  created_at: string;
  expire_date: string | null;
  user: {
    full_name: string;
    avatar_url: string;
  };
}

export const convertToFoodCardFormat = (item: FoodItem) => {
  console.log('Converting food item:', item);
  console.log('Original expire_date from database:', item.expire_date);
  
  const converted = {
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image_url || '/placeholder.svg',
    category: item.category,
    location: {
      lat: item.location_lat,
      lng: item.location_lng,
      address: item.location_address
    },
    user: {
      name: item.user.full_name,
      avatar: item.user.avatar_url || '/placeholder.svg'
    },
    user_id: item.user_id,
    postedAt: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
    expireDate: item.expire_date, // Keep the full datetime string as stored in database
    likes: 0,
    isLiked: false
  };
  
  console.log('Converted food item with expire_date:', converted.expireDate);
  return converted;
};
