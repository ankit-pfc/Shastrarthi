import Navbar from "@/components/header/Navbar";
import Footer from "@/components/landing/Footer";
export default function PublicLayout({ children, }) {
    return (<>
            <Navbar />
            {children}
            <Footer />
        </>);
}
