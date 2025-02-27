export type Vars = {
  [key: string]: number | string | string[] | undefined;
};

export type Dataquo = { data: any; certif_cl: any; fid: string };

export type Dimensi = {
  panjang: number;
  lebar: number;
  tinggi: number;
};

export type Product = {
  product_id: string;
  product_name: string;
  catid: string;
  product_type: string;
  uom: string;
  description: string | null;
  createdinfo: string;
  modifiedinfo: string | null;
  cat_name: string;
  name_type: string;
  image_url: string;
};

export type CartItem = Product & {
  quantity: number;
  cond: string;
};
