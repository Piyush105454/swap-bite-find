
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getCategoryColor = (category: string): string => {
  const colors = {
    vegetables: '#10b981',
    fruits: '#f97316',
    baked: '#eab308',
    desserts: '#ec4899',
    meals: '#3b82f6',
    dairy: '#8b5cf6',
    snacks: '#06b6d4',
    beverages: '#84cc16'
  };
  return colors[category as keyof typeof colors] || '#6b7280';
};

export const createMarkerIcon = (item: any): string => {
  const color = getCategoryColor(item.category);
  
  return `
    <div class="food-marker" style="
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      cursor: pointer;
      background-image: url(${item.image});
      background-size: cover;
      background-position: center;
      background-color: ${color};
      position: relative;
      transition: transform 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    " ontouchstart="this.style.transform='scale(1.1)'" ontouchend="this.style.transform='scale(1)'" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
      <div style="
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        color: white;
        font-weight: bold;
      ">
        ${item.category === 'vegetables' ? '🥬' : 
          item.category === 'fruits' ? '🍎' : 
          item.category === 'baked' ? '🍞' : 
          item.category === 'desserts' ? '🧁' : 
          item.category === 'meals' ? '🍽️' : 
          item.category === 'dairy' ? '🥛' : 
          item.category === 'snacks' ? '🍿' : 
          item.category === 'beverages' ? '🥤' : '🍴'}
      </div>
    </div>
  `;
};

export const createPopupContent = (item: any): string => {
  const expiryInfo = item.expire_date 
    ? `<div style="font-size: 12px; color: #ea580c; font-weight: 500; margin-top: 8px; padding: 8px; background-color: #fed7aa; border-radius: 6px;">⏰ Expires: ${new Date(item.expire_date).toLocaleDateString()}</div>`
    : '';

  return `
    <div style="padding: 16px; max-width: 260px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="position: relative; margin-bottom: 12px;">
        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;" />
        <div style="position: absolute; top: 8px; right: 8px; background-color: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; color: ${getCategoryColor(item.category)};">
          ${item.category}
        </div>
      </div>
      
      <h3 style="font-weight: bold; font-size: 15px; margin-bottom: 8px; color: #1f2937; line-height: 1.3;">${item.title}</h3>
      <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${item.description}</p>
      
      ${expiryInfo}
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #6b7280; margin-bottom: 8px;">
          <span style="display: flex; align-items: center;">
            👤 ${item.user.name}
          </span>
          <span>${item.postedAt}</span>
        </div>
        
        <div style="font-size: 11px; color: #6b7280; display: flex; align-items: center; margin-bottom: 12px;">
          📍 <span style="margin-left: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.location.address}</span>
        </div>
      </div>
      
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <button 
          onclick="window.open('https://www.google.com/maps/dir//${item.location.lat},${item.location.lng}', '_blank')"
          style="width: 100%; background-color: #10b981; color: white; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: background-color 0.2s; -webkit-tap-highlight-color: transparent;"
          ontouchstart="this.style.backgroundColor='#059669'"
          ontouchend="this.style.backgroundColor='#10b981'"
          onmouseover="this.style.backgroundColor='#059669'"
          onmouseout="this.style.backgroundColor='#10b981'"
        >
          🗺️ Get Directions
        </button>
      </div>
    </div>
  `;
};
