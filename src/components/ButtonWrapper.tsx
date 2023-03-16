import { useCallback, useEffect, useState } from "react";
import { wallet } from "../utils";
import {
  setApproved as setApprovedToMarketplace,
  isApproved,
} from "../utils/calls";
import { Spin } from "antd";

export const ApprovedWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}: any) => {
  const account = wallet.useAccount();
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function main() {
      setLoading(true);
      const approved = await isApproved(account as string);
      setApproved(approved);
      setLoading(false);
    }

    main().catch(console.log);
  }, [account]);

  const handleClick = useCallback(
    async (e: any) => {
      if (!approved) {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        await setApprovedToMarketplace(account as string);
        setApproved(true);
        setLoading(false);
      }
    },
    [approved]
  );

  return (
    <Spin spinning={loading}>
      <div onClick={handleClick}>
        {approved ? children : "Approved to MarketPlace"}
      </div>
    </Spin>
  );
};
