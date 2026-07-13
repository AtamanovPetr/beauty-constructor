export interface ServiceItem {
  name: string;
  price: string;
  image: string;
  desc: string;
}

export interface FormData {
  name: string;
  phrase: string;
  skills: string;
  services: ServiceItem[];
  logo: string;
  inst: string;
  phone: string;
  style: string;
  reviews: string;
  address: string;
  gallery: string;
  metaTitle: string;
  metaDescription: string;
  heroSlider?: string; // <-- обязательно
  clientEmail?: string;
}
