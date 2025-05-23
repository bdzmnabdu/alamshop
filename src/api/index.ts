import axios from "axios";
import type { Vars, Dataquo } from "@/types";

const apicode = "ZCiU7Oc0cxlM2mic9rNQ";
const workspace = "ALAMS";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllProducts = async (
  page: number,
  catId?: string | undefined,
  waterType?: string | string[] | undefined
) => {
  try {
    const servicecode = "cRZG/jjiOBrvF/jWdQy/ksE26twh8v7PCZpA4%2Bdk5EM%3D";
    const vars: Vars = { page_num: page, catId, waterType };
    const encodeVars = encodeURIComponent(JSON.stringify(vars));
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getProductsByKeyword = async (keyword: string, page: number) => {
  try {
    if (keyword !== "") {
      const servicecode = "cRZG/jjiOBqmJETiIQn80%2BsUprhI2CdGPTPvkQd/bHg%3D";
      const vars: Vars = { keyword, page_num: page };
      const encodeVars = encodeURIComponent(JSON.stringify(vars));
      const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
      const res = await axios.get(url);
      return res.data;
    } else {
      return "";
    }
  } catch (err) {
    throw err;
  }
};

export const getProductLogistic = async () => {
  try {
    const servicecode = "cRZG/jjiOBqVL9SRQzgW/g%2BJxn5M6c12kxvMOiiiG0I%3D";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getHSCode = async (hsc?: string | undefined) => {
  try {
    const servicecode = "88vBgix/qQBYQ5rlHz%2Bh5BQTkQlMyxngCZpA4%2Bdk5EM%3D";
    const vars: Vars = { hscode: hsc };
    const encodeVars = encodeURIComponent(JSON.stringify(vars));
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
    const res = await axios.get(url);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const searchHSCode = async () => {
  try {
    const servicecode = "88vBgix/qQBYQ5rlHz%2Bh5BQTkQlMyxngCZpA4%2Bdk5EM%3D";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCity = async () => {
  try {
    const servicecode = "88vBgix/qQC1SeS2D7C8tqKTt9j/mkU1";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSKACOO = async () => {
  try {
    const servicecode = "88vBgix/qQBSeP1tzLGMjXfcbGDf7qgOvZUIoFC/Ku0%3D";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const trackOrder = async (order_num: string) => {
  try {
    if (order_num !== "") {
      const servicecode = "88vBgix/qQC2SF%2BLDtKfxH2o4cUMmif3v5%2BP9TeZRW8%3D";
      const vars: Vars = { ordernum: order_num };
      const encodeVars = encodeURIComponent(JSON.stringify(vars));
      const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
      const res = await axios.get(url);

      return res.data;
    } else {
      return "";
    }
  } catch (err) {
    throw err;
  }
};

export const getPack = async () => {
  try {
    const servicecode = "88vBgix/qQAelwYLS2jKVjGu9F7AH49d";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getnowa = async () => {
  try {
    const servicecode = "88vBgix/qQAHYhWDC8%2BLd0PR6JCnCLDD";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const postQuo = async (formDataQuo: any) => {
  try {
    const fd = new FormData();
    fd.append("argt", "vars");
    if (formDataQuo.dtLog.legalitasPT)
      fd.append("1", formDataQuo.dtLog.legalitasPT);

    const data_quo: Dataquo = {
      data: formDataQuo,
      certif_cl: formDataQuo.dtLog.legalitasPT
        ? formDataQuo?.dtLog?.legalitasPT?.name
        : null,
      fid: "1",
    };

    fd.append("argl", JSON.stringify(data_quo));

    const servicecode = "88vBgix/qQDxtg37IwTCDtGu4lY7f0wP";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const response = await axios.post(url, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postQuoLog = async (formDataQuo: any) => {
  try {
    const fd = new FormData();
    fd.append("argt", "vars");

    if (formDataQuo.legalitasPT instanceof File) {
      fd.append("1", formDataQuo.legalitasPT);
    }

    const data_quo: Dataquo = {
      data: formDataQuo,
      certif_cl: formDataQuo.legalitasPT
        ? formDataQuo?.legalitasPT?.name
        : null,
      fid: "1",
    };

    fd.append("argl", JSON.stringify(data_quo));

    const servicecode = "88vBgix/qQDxtg37IwTCDtGu4lY7f0wP";
    const url = `${API_BASE_URL}/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const response = await axios.post(url, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
