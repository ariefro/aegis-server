function rupiah(number) {
  const format = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    minimumSignificantDigits: 1,
    currency: 'IDR',
  })
    .format(number)
    .replace(/\s+/, ' ');

  return format;
}

export default rupiah;
