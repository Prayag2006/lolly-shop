export const getProductSlugUrl = (prod) => {
  if (!prod) return '';
  const cleanName = prod.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `/product/${cleanName}-${prod.id}`;
};

export const getProductIdFromSlug = (slugOrId) => {
  if (!slugOrId) return '';
  if (slugOrId.startsWith('p-')) return slugOrId;
  const parts = slugOrId.split('-');
  
  // Check if the last part is a MongoDB ObjectId (24 char hex)
  const lastPart = parts[parts.length - 1];
  if (lastPart && /^[0-9a-fA-F]{24}$/.test(lastPart)) {
    return lastPart;
  }

  if (parts.length >= 2) {
    const pIdx = parts.lastIndexOf('p');
    if (pIdx !== -1 && pIdx < parts.length - 1 && !isNaN(parts[pIdx + 1])) {
      return `p-${parts[pIdx + 1]}`;
    }
    
    // If no 'p-' format found, assume the ID is the last part
    return lastPart;
  }
  return slugOrId;
};
