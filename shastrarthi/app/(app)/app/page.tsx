import DashboardHero from "@/components/app/DashboardHero";
import IntentBuilder from "@/components/landing/IntentBuilder";
import PopularTasks from "@/components/landing/PopularTasks";

export default function AppHomePage() {
    return (
        <div className="space-y-8">
            <DashboardHero />
            <IntentBuilder compact routePrefix="/app/discover" />
            <PopularTasks />
        </div>
    );
}
