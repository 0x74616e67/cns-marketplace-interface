import { useCallback, useEffect, useState } from "react";
import { Row, Col, Button, Modal, InputNumber, Tag, Spin } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  type SellType,
  listItem,
  getOwnedNFTs,
  cancelListing,
  updateListing,
} from "../../utils/calls";
import { wallet } from "../../utils";
import { ApprovedWrapper } from "../../components/ButtonWrapper";
import { NameType } from "../../utils/interface";
import { DEFAULT_PRICE } from "../../utils/const";

const { confirm } = Modal;

function Item({
  data,
  onSell,
  onUpdate,
  onCancelListing,
}: {
  data: NameType;
  onSell: (args: SellType) => Promise<void>;
  onUpdate: (args: SellType) => Promise<void>;
  onCancelListing: (tokenId: string) => Promise<void>;
}) {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState<"sell" | "update">("sell");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = useCallback((value: number) => {
    setPrice(value);
  }, []);

  // const handleTransfer = useCallback(() => {
  //   console.log("transfer item is: ", data);
  // }, [data]);

  const handleSell = async () => {
    setType("sell");
    setPrice(DEFAULT_PRICE);
    setModalIsOpen(true);
  };

  const handleUpdate = async () => {
    setType("update");
    setPrice(Number(data.price));
    setModalIsOpen(true);
  };

  const handleCancelSell = async () => {
    confirm({
      title: "Warning",
      icon: <ExclamationCircleFilled />,
      content: "Do you Want to cancel sell this name?",
      async onOk() {
        return await onCancelListing(data.tokenId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleOK = useCallback(async () => {
    setLoading(true);

    if (type === "sell") {
      await onSell({
        price,
        tokenId: data.tokenId,
      });
    } else {
      await onUpdate({
        price,
        tokenId: data.tokenId,
      });
    }

    setLoading(false);
    setModalIsOpen(false);
  }, [price]);

  const handleClose = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  return (
    <>
      <div className="p-2 text-base flex flex-col justify-between h-[120px] shadow-lg bg-white rounded-sm">
        <div className="break-all">{data.name}</div>

        {data.price === "0" ? (
          <div className="text-right">
            {/* <Button size="small" onClick={handleTransfer}>
              Transfer
            </Button> */}
            <Button size="small" className="ml-2" onClick={handleSell}>
              Sell
            </Button>
          </div>
        ) : (
          <>
            <div className="break-all">
              <Tag>Selling</Tag> - <small>{data.price} CFX</small>
            </div>
            <div className="text-right">
              <Button size="small" className="ml-2" onClick={handleUpdate}>
                Update Price
              </Button>
              <Button size="small" className="ml-2" onClick={handleCancelSell}>
                Cancel Sell
              </Button>
            </div>
          </>
        )}
      </div>
      {/* sell modal */}
      <Modal
        title={type === "sell" ? "Sell" : "Update Price"}
        onCancel={handleClose}
        onOk={handleOK}
        open={modalIsOpen}
        okText={<ApprovedWrapper>OK</ApprovedWrapper>}
        confirmLoading={loading}
      >
        <div className="mb-2">CNS: {data.name}</div>
        <div>
          <div className="flex items-center">
            <InputNumber
              min={0}
              value={price}
              className="w-40"
              onChange={(val) => handleInputChange(val || 0)}
            />
            <span className="ml-2">CFX</span>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function MyCNS() {
  const account = wallet.useAccount();
  const [names, setNames] = useState<NameType[]>([]);
  const [pageLoading, setPageLoading] = useState(false);

  const getList = useCallback(async () => {
    if (account) {
      setPageLoading(true);
      const names = await getOwnedNFTs(account);
      setNames(names);
      setPageLoading(false);
    }
  }, [account]);

  useEffect(() => {
    getList();
  }, [account]);

  const handleSell = useCallback(
    async ({ price, tokenId }: SellType) => {
      await listItem({
        account: account as string,
        price,
        tokenId,
      });

      await getList();
    },
    [account]
  );

  const handleUpdate = useCallback(
    async ({ price, tokenId }: SellType) => {
      await updateListing({
        account: account as string,
        price,
        tokenId,
      });

      await getList();
    },
    [account]
  );

  const handleCancelSell = async function (tokenId: string) {
    console.log("tokenId: ", tokenId);
    await cancelListing(account as string, tokenId);

    await getList();
  };

  return (
    <Spin spinning={pageLoading}>
      <Row gutter={[16, 16]} className="p-4">
        {names.length ? (
          names.map((d, i) => (
            <Col xs={12} sm={12} md={8} lg={6} xl={6} key={d.tokenId}>
              <Item
                data={d}
                onSell={handleSell}
                onUpdate={handleUpdate}
                onCancelListing={handleCancelSell}
              ></Item>
            </Col>
          ))
        ) : (
          <div className="p-4">No Result</div>
        )}
      </Row>
    </Spin>
  );
}
