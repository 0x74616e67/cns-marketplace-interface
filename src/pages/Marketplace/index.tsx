import { useCallback, useEffect, useState } from "react";
import { getSellingNFTs, buyItem } from "../../utils/calls";
import { NameType } from "../../utils/interface";
import { Row, Col, Button, Tooltip, Spin } from "antd";
import { DEFAULT_SKIP, DEFAULT_LIMIT, DEFAULT_FEE } from "../../utils/const";
import { wallet } from "../../utils";
import BigNumber from "bignumber.js";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function Marketplace() {
  const account = wallet.useAccount();
  const status = wallet.useStatus();
  const [names, setNames] = useState<NameType[]>([]);
  const [pageLoading, setPageLoading] = useState(false);

  const skip = DEFAULT_SKIP;
  const limit = DEFAULT_LIMIT;

  const getList = useCallback(async function (skip: number, limit: number) {
    setPageLoading(true);
    try {
      const names = await getSellingNFTs(skip, limit);
      setNames(names);
    } catch (error) {
      console.log("marketplace page, getList error: ", error);
    }

    setPageLoading(false);
  }, []);

  useEffect(() => {
    getList(skip, limit);
  }, [skip, limit]);

  const handleBuy = async ({ tokenId, price }: any) => {
    await buyItem({
      account: account as string,
      tokenId,
      price: new BigNumber(price).multipliedBy(1 + DEFAULT_FEE),
    });

    await getList(skip, limit);
  };

  return (
    <Spin spinning={pageLoading}>
      <Row gutter={[16, 16]} className="p-4">
        {names.length ? (
          names.map((n) => (
            <Col
              xs={12}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              key={n.tokenId}
              className=""
            >
              <div className="p-2 text-base flex flex-col justify-between h-[120px] shadow-lg bg-white rounded-sm">
                <div className="break-all">Name: {n.name}</div>
                <div className="break-all text-sm">
                  <div>Price: {n.price} CFX</div>
                  <div className="flex items-center justisfy-center text-xs">
                    Fees
                    <Tooltip title="After the transaction is successful, a 2.5% handling fee will be charged">
                      <QuestionCircleOutlined className="mx-1" />
                    </Tooltip>{" "}
                    :{" "}
                    {new BigNumber(n.price)
                      .multipliedBy(DEFAULT_FEE)
                      .toString()}{" "}
                    CFX
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    size="small"
                    className="ml-2"
                    onClick={() => handleBuy(n)}
                    disabled={status !== "active"}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <div className="p-4">No Result</div>
        )}
      </Row>
    </Spin>
  );
}
