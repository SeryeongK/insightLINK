import axios, { AxiosResponse } from "axios";

export const DELETE = async (
  uri: string,
  headers?: any
): Promise<any | null> => {
  try {
    let res: AxiosResponse;
    if (headers) {
      res = await axios.delete(`${uri}`, headers);
    } else {
      res = await axios.delete(`${uri}`);
    }
    console.log("DELETE 성공");
    return res.data;
  } catch (err) {
    console.log("DELETE 실패", err);
    return err;
  }
};
