"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { POPULAR_TASKS } from "@/lib/config/tasks";

export default function PopularTasks() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-h2 font-serif font-semibold text-gray-900 mb-2">
                        Popular Study Tasks
                    </h2>
                    <p className="text-gray-600">
                        Run a task to get started quickly.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {POPULAR_TASKS.map((task) => {
                        const Icon = task.icon;
                        return (
                            <button
                                key={task.title}
                                className="text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                <div className="p-5 min-h-[156px]">
                                    <h3 className="text-gray-900 font-semibold mb-2">{task.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                                </div>
                                <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-600 inline-flex items-center gap-2 w-full">
                                    <Icon className="h-4 w-4" />
                                    Run Task
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/app/gallery"
                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        View Guru Gallery
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
