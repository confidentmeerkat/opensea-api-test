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
    console.log(params);
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
      <Box display="flex" flexDirection="column">
        <TextField
          margin="dense"
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          fullWidth
          label="Owner"
          value={owner}
          placeholder="Owner's address"
          onChange={(e) => setOwner(e.target.value)}
        />
        <TextField
          label="Collection"
          margin="dense"
          fullWidth
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        />
        <TextField
          label="Limit"
          margin="dense"
          fullWidth
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      </Box>
      {nftElements}
    </Container>
  );
}
