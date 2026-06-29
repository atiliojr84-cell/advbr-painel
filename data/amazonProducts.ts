// data/siteProducts.ts
export type SiteProduct = {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  link: string;         // pode ser /produto/slug ou link externo
  description?: string;
};

export const siteProducts: SiteProduct[] = [
  {
    id: "notebook-1",
    title: "Notebook Ultrafino X",
    price: "R$ 4.299,00",
    imageUrl: "/images/notebook-x.png",
    link: "/produtos/notebook-ultrafino-x",
    description: "Notebook leve, ideal para trabalho remoto."
  },
  // ...adicione pelo menos 10 produtos aqui
];
