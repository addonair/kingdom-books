// Delivery thresholds and pickup point info. Single import point so swapping
// to a backend-driven settings endpoint is a one-file change.

export const FREE_DELIVERY_THRESHOLD = 50
export const DELIVERY_FEE = 15

export const PICKUP_POINT = {
  name: 'Kingdom Books & Stationery',
  description:
    'Pick up at our main store counter. Your order will be ready within 2 hours of payment confirmation.',
  address: 'Balme Library Complex, University of Ghana, Legon, Accra',
  gpsCode: 'GA-044-0059',
  hours: 'Mon – Fri: 8:00am – 5:00pm  ·  Sat: 9:00am – 2:00pm',
  phone: '+233 20 000 0000',
}
