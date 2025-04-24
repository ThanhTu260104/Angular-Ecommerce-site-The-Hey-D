export interface ILoai {
  id: number;
  ten_loai: string;
  thu_tu: number;
  slug: string;
  an_hien: number| boolean;
  created_at: string;
  updated_at: string;
  so_san_pham: number;
}
export interface IThuocTinh {
  ram: string;
  cpu: string;
  dia_cung: string;
  mau_sac: string;
  can_nang: number;
}
export interface ISanPham {
  id: number;
  ten_sp: string;
  gia: number;
  gia_km: number;
  ngay: string;
  hinh: string;
  id_loai: number;
  luot_xem: number;
  mo_ta: string;
  hot: string;
  an_hien: string;
  slug: string;
  tinh_chat: string;
  created_at: string;
  updated_at: string;
  hinh_public_id?: string;

  loai?: ILoai;
  thuoc_tinh?: IThuocTinh;
}

export interface ICart {
  id: number;
  ten_sp: string;
  so_luong: number;
  gia_mua: number;
  hinh: string;
}
export interface ITinTuc {
  id: number;
  tieu_de: string;
  slug: string;
  mo_ta: string | null;
  hinh: string | null;
  ngay: string | null;
  noi_dung: string | null;
  id_loai: number;
  luot_xem: number;
  hot: number;
  an_hien: number;
  tags: string | null;

  ten_loai? : ILoaiTin
}

export interface ILoaiTin {
  ten_loai: string
}
export class Loai {
  id!: number;
  ten_loai!: string;
  thu_tu!: number;
  slug!: string;
  an_hien!: number | boolean;
  created_at!: string;
  updated_at!: string;
  so_san_pham!: number;
}
export class ThuocTinh {
  ram!: string;
  cpu!: string;
  dia_cung!: string;
  mau_sac!: string;
  can_nang!: number;
}
export class SanPham {
  id!: number;
  ten_sp!: string;
  gia!: number;
  gia_km!: number;
  ngay!: string;
  hinh!: string;
  id_loai!: number;
  luot_xem!: number;
  mo_ta!: string;
  hot!: string;
  an_hien!: string;
  slug!: string;
  tinh_chat!: string;
  created_at!: string;
  updated_at!: string;
  hinh_public_id!: string;
  loai?: Loai;
  thuoc_tinh?: ThuocTinh;
}

