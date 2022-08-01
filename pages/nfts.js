import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import Asset from "../components/asset";
import Container from "../components/container";
import { getNFTs } from "../helpers/api";

export default function Nfts() {
  const [limit, setLimit] = useState(20);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [collection, setCollection] = useState("");

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let params = { limit };

    if (owner) params.owner = owner;
    if (collection) params.collection = collection;
    getNFTs(params).then(({ data: { assets } }) => {
      setAssets(assets);
    });
  }, [limit, owner, collection]);

  const nftElements = useMemo(() => {
    return assets
      .filter((asset) => asset.name && asset.name.includes(name))
      .map((asset) => <Asset item={asset} key={asset.id} />);
  }, [assets, name]);

  return (
    <Container>
      <h5 className="ml-5 pt-2">Search Options</h5>
      <div className="m-2 flex md:flex-row sm:flex-col flex-col md:space-x-2 sm:space-y-2 space-y-2 justify-center">
        <TextField
          margin="dense"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Owner"
          value={owner}
          placeholder="Owner's address"
          onChange={(e) => setOwner(e.target.value)}
        />
        <TextField
          label="Collection"
          margin="dense"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        />
        <TextField
          label="Limit"
          margin="dense"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      </div>

      <hr className="w-full" />
      <Box>
        <h5 className="ml-5 text-lg pt-2 font-bold text-blue-800">
          <i>Result</i>
        </h5>
        {nftElements}
      </Box>
    </Container>
  );
}
