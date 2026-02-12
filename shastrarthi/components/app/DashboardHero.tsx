import TaskInput from "./TaskInput";

export default function DashboardHero() {
    return (
        <section className="pt-6 pb-2">
            <div className="text-center mb-5">
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1.5">
                    How can I help with your Shastra research?
                </h1>
                <p className="text-sm text-gray-400">
                    Connect apps and import data for your research.
                </p>
            </div>
            <TaskInput />
        </section>
    );
}
