function generateSlug(str) {
  return str.replace(/\s+/g, '-').toLowerCase();
}

export default generateSlug;
