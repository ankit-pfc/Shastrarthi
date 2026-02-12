import TaskInput from "./TaskInput";

export default function DashboardHero() {
    return (
        <section className="pt-8 pb-4">
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-2">
                    How can I help with your Shastra research?
                </h1>
                <p className="text-gray-500">
                    Connect apps and import data for your research.
                </p>
            </div>
            <TaskInput />
        </section>
    );
}
