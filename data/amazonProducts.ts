// data/amazonProducts.ts

export interface Product {
  id: string;
  imageUrl: string; // Caminho para a imagem do produto na pasta public/images
  title: string;
  price: string;
  amazonLink: string; // Link de afiliado da Amazon
}

export const amazonProducts: Product[] = [
  {
    id: 'ssd-nvme-1tb',
    imageUrl: '/images/ssd-nvme-1tb.jpg',
    title: 'SSD NVMe Kingston NV2 1TB, M.2 2280 PCIe 4.0 NVMe',
    price: 'R$ 399,90',
    amazonLink: 'https://www.amazon.com.br/dp/B0B25TCHW5?tag=SEU_ID_AFILIADO_AQUI', // SUBSTITUA SEU_ID_AFILIADO_AQUI PELO SEU ID REAL
  },
  {
    id: 'monitor-dell-24',
    imageUrl: '/images/monitor-dell-24.jpg',
    title: 'Monitor Dell 24" Full HD, IPS, HDMI, DisplayPort',
    price: 'R$ 899,00',
    amazonLink: 'https://www.amazon.com.br/dp/B08J82X93L?tag=SEU_ID_AFILIADO_AQUI',
  },
  {
    id: 'webcam-logitech-c920',
    imageUrl: '/images/webcam-logitech-c920.jpg',
    title: 'Webcam Logitech C920s Pro HD, 1080p, com tampa de privacidade',
    price: 'R$ 329,90',
    amazonLink: 'https://www.amazon.com.br/dp/B07P2CH95P?tag=SEU_ID_AFILIADO_AQUI',
  },
  {
    id: 'mouse-logitech-mxmaster3s',
    imageUrl: '/images/mouse-logitech-mxmaster3s.jpg',
    title: 'Mouse Logitech MX Master 3S, Sem Fio, Ergonômico',
    price: 'R$ 599,00',
    amazonLink: 'https://www.amazon.com.br/dp/B09V22V2QG?tag=SEU_ID_AFILIADO_AQUI',
  },
  {
    id: 'teclado-mecanico-redragon',
    imageUrl: '/images/teclado-mecanico-redragon.jpg',
    title: 'Teclado Mecânico Redragon Kumara K552, Switch Outemu Red',
    price: 'R$ 249,90',
    amazonLink: 'https://www.amazon.com.br/dp/B072FMZ2JB?tag=SEU_ID_AFILIADO_AQUI',
  },
];
