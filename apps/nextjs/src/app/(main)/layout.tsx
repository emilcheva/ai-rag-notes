import { Navbar } from "./navbar";

const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="p-4">{children}</div>
    </>
  );
};
export default NotesLayout;
