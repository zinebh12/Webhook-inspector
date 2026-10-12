import { Navbar } from "@/components/layout/NavBar";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar /> {children}
    </>
  );
};

export default layout;
