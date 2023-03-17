import { useCallback, useMemo, useState } from "react";
import { Layout, Menu } from "antd";
import ConnectWalletButton from "./components/ConnectWalletButton";
import Warning from "./components/Warning";
import MyCNS from "./pages/MyCNS";
import Marketplace from "./pages/Marketplace";

const { Header } = Layout;

export default function App() {
  const [menuKey, setMenuKey] = useState("market-place");

  const MENU_ITEMS = useMemo(
    () => [
      {
        key: "market-place",
        text: "Marketplace",
      },
      {
        key: "my-cns",
        text: "My CNS",
      },
    ],
    []
  );

  const handleMenuChange = useCallback(({ key }: { key: string }) => {
    setMenuKey(key);
  }, []);

  const CONTENT = useMemo(() => {
    return menuKey === "my-cns" ? <MyCNS></MyCNS> : <Marketplace></Marketplace>;
  }, [menuKey]);

  return (
    <Layout className="layout h-full bg-gray-100">
      <Header>
        <div className="text-white text-lg float-left flex justify-center items-center h-full"></div>
        <Menu
          className="float-left"
          theme="dark"
          mode="horizontal"
          selectedKeys={[menuKey]}
          onClick={handleMenuChange}
          items={MENU_ITEMS.map((m) => {
            return {
              key: m.key,
              label: m.text,
            };
          })}
        />
        <ConnectWalletButton></ConnectWalletButton>
      </Header>
      <Warning></Warning>
      {CONTENT}
    </Layout>
  );
}
