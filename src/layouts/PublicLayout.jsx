import Navbar from "../components/Navbar";




function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}




export default PublicLayout;
