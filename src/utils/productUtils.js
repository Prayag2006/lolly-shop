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
    // getProductSlugUrl always appends the raw id (which always starts with "p-") as the
    // final segment(s) of the slug. The id itself can be any hyphenated string, not just a
    // numeric timestamp (e.g. "p-ch-wild-berry-sf") — so take everything from the last
    // standalone "p" segment to the end, rather than assuming only one numeric part follows.
    const pIdx = parts.lastIndexOf('p');
    if (pIdx !== -1 && pIdx < parts.length - 1) {
      return parts.slice(pIdx).join('-');
    }

    // If no 'p-' format found, assume the ID is the last part
    return lastPart;
  }
  return slugOrId;
};
