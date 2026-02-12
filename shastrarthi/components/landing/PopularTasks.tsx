"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { POPULAR_TASKS } from "@/lib/config/tasks";

export default function PopularTasks() {
    return (
        <section className="bg-gray-50 py-14">
            <div className="container mx-auto px-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                        Popular Study Tasks
                    </h2>
                    <p className="text-sm text-gray-500">
                        Run a task to get started quickly.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {POPULAR_TASKS.map((task) => {
                        const Icon = task.icon;
                        return (
                            <button
                                key={task.title}
                                className="text-left bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                            >
                                <div className="p-4 min-h-[132px]">
                                    <h3 className="text-gray-900 font-medium text-sm mb-1.5">{task.title}</h3>
                                    <p className="text-[13px] text-gray-500 leading-relaxed">{task.description}</p>
                                </div>
                                <div className="px-4 py-2.5 border-t border-gray-100 text-[13px] text-gray-500 inline-flex items-center gap-2 w-full">
                                    <Icon className="h-4 w-4" />
                                    Run Task
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/app/gallery"
                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        View Guru Gallery
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
