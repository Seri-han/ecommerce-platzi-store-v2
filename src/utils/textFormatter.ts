
export const cleanProductName = (title: string) => {
  if (!title) return 'Product';
  
  let cleaned = title
    .replace(/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi, '')
    .replace(/\b[a-f0-9]{7,}\b/gi, '')
    .replace(/\d{10,}\b/g, '')
    .replace(/prod-cat-\d+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.length > 3 ? cleaned : title;
};


export const formatPrice = (price: number) => {
  let numPrice = parseFloat(String(price));
  
  if (isNaN(numPrice)) {
    return '$0.00';
  }
  if (numPrice > 500) {
    const priceStr = numPrice.toString();
    if (numPrice > 10000 && !priceStr.includes('.')) {
      numPrice = numPrice / 100;
    } else if (numPrice > 500) {
      numPrice = 0;
    }
  }

  if (numPrice < 0 || numPrice > 1000) {
    return '$0.00';
  }

  return `$${numPrice.toFixed(2)}`;
};

export const truncateText = (text: string, length = 60) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};