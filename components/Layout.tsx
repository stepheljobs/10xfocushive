import Header from "./Header";

const Layout = ({ children }: any) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

export default Layout;