// data/amazonProducts.ts

export type Product = {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  amazonLink: string;
};

// Lista de produtos afiliados da Amazon exibidos no carrossel (Módulo 08)
export const amazonProducts: Product[] = [
  {
    id: "monitor-dell-24",
    imageUrl: "/images/monitor-dell-24.jpg",
    title: "Monitor Dell 24'' Full HD",
    price: "R$ 899,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_MONITOR"
  },
  {
    id: "mouse-logitech-mxmaster3s",
    imageUrl: "/images/mouse-logitech-mxmaster3s.jpg",
    title: "Mouse Logitech MX Master 3S Sem Fio",
    price: "R$ 549,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_MOUSE"
  },
  {
    id: "ssd-nvme-1tb",
    imageUrl: "/images/ssd-nvme-1tb.jpg",
    title: "SSD NVMe 1TB Alta Velocidade",
    price: "R$ 499,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_SSD"
  },
  {
    id: "teclado-mecanico-redragon",
    imageUrl: "/images/teclado-mecanico-redragon.jpg",
    title: "Teclado Mecânico Redragon RGB ABNT2",
    price: "R$ 329,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_TECLADO"
  },
  {
    id: "webcam-logitech-c920",
    imageUrl: "/images/webcam-logitech-c920.jpg",
    title: "Webcam Logitech C920 Full HD 1080p",
    price: "R$ 399,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_WEBCAM"
  },
  {
    id: "headset-usb-profissional",
    imageUrl: "/images/headset-usb-profissional.jpg",
    title: "Headset USB Profissional com Microfone",
    price: "R$ 249,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_HEADSET"
  },
  {
    id: "hub-usb-c-6-em-1",
    imageUrl: "/images/hub-usb-c-6em1.jpg",
    title: "Hub USB-C 6 em 1 para Notebook",
    price: "R$ 289,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_HUB"
  },
  {
    id: "base-refrigerada-notebook",
    imageUrl: "/images/base-refrigerada-notebook.jpg",
    title: "Base Refrigerada para Notebook",
    price: "R$ 149,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_BASE"
  },
  {
    id: "nobreak-escritorio",
    imageUrl: "/images/nobreak-escritorio.jpg",
    title: "Nobreak para Escritório 1200VA",
    price: "R$ 799,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_NOBREAK"
  },
  {
    id: "cadeira-ergonomica-office",
    imageUrl: "/images/cadeira-ergonomica-office.jpg",
    title: "Cadeira Ergonômica Office para Escritório",
    price: "R$ 1.299,00",
    amazonLink: "https://www.amazon.com.br/dp/SEU_ID_AFILIADO_CADEIRA"
  }
];
