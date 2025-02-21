import axios from "axios";

const apicode = "ZCiU7Oc0cxlM2mic9rNQ";
const workspace = "ALAMS";
type Vars = {
  page_num: number;
  catId?: string | undefined;
  waterType?: string | string[] | undefined;
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllProducts = async (
  page: number,
  catId?: string | undefined,
  waterType?: string | string[] | undefined
) => {
  try {
    // console.log(typeof page);
    const servicecode = "cRZG/jjiOBrvF/jWdQy/ksE26twh8v7PCZpA4%2Bdk5EM%3D";
    const vars: Vars = { page_num: page, catId, waterType };
    console.log(vars);
    const encodeVars = encodeURIComponent(JSON.stringify(vars));
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getProductsByKeyword = async (keyword: string, page: number) => {
  try {
    if (keyword !== "") {
      const servicecode = "cRZG/jjiOBqmJETiIQn80%2BsUprhI2CdGPTPvkQd/bHg%3D";
      const vars = { keyword, page_num: page };
      const encodeVars = encodeURIComponent(JSON.stringify(vars));
      const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
      const res = await axios.get(url);
      console.log(res.data);
      return res.data;
    } else {
      return "";
    }
  } catch (err) {
    throw err;
  }
};

export const getHSCode = async (hsc?: string | undefined) => {
  try {
    const servicecode = "88vBgix/qQBYQ5rlHz%2Bh5BQTkQlMyxngCZpA4%2Bdk5EM%3D";
    const vars = { hscode: hsc };
    const encodeVars = encodeURIComponent(JSON.stringify(vars));
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const searchHSCode = async () => {
  try {
    const servicecode = "88vBgix/qQBYQ5rlHz%2Bh5BQTkQlMyxngCZpA4%2Bdk5EM%3D";
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCity = async () => {
  try {
    const servicecode = "88vBgix/qQC1SeS2D7C8tqKTt9j/mkU1";
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSKACOO = async () => {
  try {
    const servicecode = "88vBgix/qQBSeP1tzLGMjXfcbGDf7qgOvZUIoFC/Ku0%3D";
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
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
      const vars = { ordernum: order_num };
      const encodeVars = encodeURIComponent(JSON.stringify(vars));
      const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode};vars=${encodeVars}`;
      const res = await axios.get(url);
      console.log(res.data);
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
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const postQuo = async (formDataQuo: any) => {
  try {
    console.log(formDataQuo);
    type dataquo = { data: any; certif_cl: any; fid: string };
    // console.log(dataQuo.legalitasPT);
    //const certif_cl = dataQuo.dtLog.legalitasPT ? {fcertif_cl: dataQuo?.dtLog?.legalitasPT, filename: dataQuo?.dtLog?.legalitasPT?.name, fid: "1"} : '';
    const fd = new FormData();
    fd.append("argt", "vars");
    // fd.append("1", dataQuo.legalitasPT);
    if (formDataQuo.dtLog.legalitasPT)
      fd.append("1", formDataQuo.dtLog.legalitasPT);

    const data_quo: dataquo = {
      data: formDataQuo,
      certif_cl: formDataQuo.dtLog.legalitasPT
        ? formDataQuo?.dtLog?.legalitasPT?.name
        : null,
      fid: "1",
    };
    console.log(JSON.stringify(data_quo));
    fd.append("argl", JSON.stringify(data_quo));

    const servicecode = "88vBgix/qQDxtg37IwTCDtGu4lY7f0wP";
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const response = await axios.post(url, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response:", response);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postQuoLog = async (formDataQuo: any) => {
  try {
    type dataquo = { data: any; certif_cl: any; fid: string };
    const fd = new FormData();
    fd.append("argt", "vars");

    if (formDataQuo.legalitasPT) fd.append("1", formDataQuo.legalitasPT);

    const data_quo: dataquo = {
      data: formDataQuo,
      certif_cl: formDataQuo.legalitasPT
        ? formDataQuo?.legalitasPT?.name
        : null,
      fid: "1",
    };
    // console.log(JSON.stringify(data_quo));
    fd.append("argl", JSON.stringify(data_quo));

    const servicecode = "88vBgix/qQDxtg37IwTCDtGu4lY7f0wP";
    const url = `/txn?fnc=runLib;opic=${apicode};csn=${workspace};rc=${servicecode}`;
    const response = await axios.post(url, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response:", response);

    return response.data;
  } catch (error) {
    throw error;
  }
};
