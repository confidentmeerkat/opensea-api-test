import Axios from "axios";

export async function getNFTs(params) {
  return await Axios.get("https://api.opensea.io/api/v1/assets", {
    params,
  });
}
