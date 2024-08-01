"use client";

import Link from "next/link";
import Icon from "@component/icon/Icon";
import TableRow from "@component/TableRow";
import Typography from "@component/Typography";
import { IconButton } from "@component/buttons";
import { CustomerAddress } from "@prisma/client";

interface AddressItemProps {
  item: CustomerAddress;
  onDelete: () => void;
}

export default function AddressItem({ item, onDelete }: AddressItemProps) {
  return (
    <TableRow my="1rem" padding="6px 18px">
      <Typography className="pre" m="6px" textAlign="left">
        {item.title}
      </Typography>

      <Typography flex="1 1 260px !important" m="6px" textAlign="left">
        {`${item.street}, ${item.city}, ${item.state || ""} ${
          item.zipCode || ""
        }, ${item.country}`}
      </Typography>

      <Typography className="pre" m="6px" textAlign="left">
        {item.phone || "N/A"}
      </Typography>

      <Typography className="pre" textAlign="center" color="text.muted">
        <Link href={`/address/${item.id}`}>
          <IconButton>
            <Icon variant="small" defaultcolor="currentColor">
              edit
            </Icon>
          </IconButton>
        </Link>

        <IconButton onClick={onDelete}>
          <Icon variant="small" defaultcolor="currentColor">
            delete
          </Icon>
        </IconButton>
      </Typography>
    </TableRow>
  );
}
