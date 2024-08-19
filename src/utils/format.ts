import { format, parseISO } from "date-fns";

export const formatDateTime = (date:string): null|string => {
  if (!date) return null;
  return format(parseISO(date), 'dd-MM-yyyy HH:mm') + 'Z';
}

export const formatUsdCurrency = (value:string|null): null|string => {
  if (!value) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value));
}