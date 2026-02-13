import DashboardHero from "@/components/app/DashboardHero";
import IntentBuilder from "@/components/landing/IntentBuilder";
import PopularTasks from "@/components/landing/PopularTasks";
import ContinueReading from "@/components/app/ContinueReading";
import RecentShastraBooks from "@/components/app/RecentShastraBooks";

export default function AppHomePage() {
    return (
        <div className="space-y-6">
            <DashboardHero />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContinueReading />
                <RecentShastraBooks />
            </div>
            <IntentBuilder compact routePrefix="/app/discover" />
            <PopularTasks />
        </div>
    );
}
