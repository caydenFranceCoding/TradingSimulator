// format currency with $ symbol and 2 decimal places
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

//format percent with % symbol and 2 decimal places
export const formatPercentage = (percentage) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(percentage / 100);
};

// format large number with commas
export const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
};

//format the date as MM/DD/YYYY
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
};