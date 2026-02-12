import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
export default function AppLayout({ children }) {
    return (<div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
                <TopBar />
                <main className="p-4 md:p-6">{children}</main>
            </div>
        </div>);
}
