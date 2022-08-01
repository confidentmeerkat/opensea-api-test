import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";

export default function Asset({ item }) {
  return (
    <ListItem>
      <ListItemIcon>
        <Avatar
          src={
            item.image_thumbnail_url || item.image_preview_url || item.image_url
          }
        ></Avatar>
      </ListItemIcon>
      <ListItemText
        primary={item.name}
        secondary={item.description && item.description.slice(0, 200)}
      ></ListItemText>
    </ListItem>
  );
}
