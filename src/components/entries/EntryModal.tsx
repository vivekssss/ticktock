"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { PROJECTS, WORK_TYPES, TimesheetEntry } from "@/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface EntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        taskDescription: string;
        project: string;
        typeOfWork: string;
        hours: number;
        date: string;
    }) => Promise<void>;
    entry?: TimesheetEntry | null;
    date?: string;
}

interface FormErrors {
    project?: string;
    typeOfWork?: string;
    taskDescription?: string;
    hours?: string;
}

export default function EntryModal({
    isOpen,
    onClose,
    onSubmit,
    entry,
    date,
}: EntryModalProps) {
    const isEditing = !!entry;

    const [project, setProject] = useState("");
    const [typeOfWork, setTypeOfWork] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [hours, setHours] = useState(4);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (entry) {
            setProject(entry.project);
            setTypeOfWork(entry.typeOfWork);
            setTaskDescription(entry.taskDescription);
            setHours(entry.hours);
        } else {
            setProject("");
            setTypeOfWork("");
            setTaskDescription("");
            setHours(4);
        }
        setErrors({});
    }, [entry, isOpen]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!project) newErrors.project = "Project is required";
        if (!typeOfWork) newErrors.typeOfWork = "Type of work is required";
        if (!taskDescription.trim())
            newErrors.taskDescription = "Task description is required";
        if (hours <= 0) newErrors.hours = "Hours must be greater than 0";
        if (hours > 24) newErrors.hours = "Hours cannot exceed 24";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                taskDescription: taskDescription.trim(),
                project,
                typeOfWork,
                hours,
                date: entry?.date || date || new Date().toISOString().split("T")[0],
            });
            onClose();
        } catch {
            setErrors({ taskDescription: "Failed to save entry. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const projectOptions = PROJECTS.map((p) => ({
        value: p.name,
        label: p.name,
    }));

    const workTypeOptions = WORK_TYPES.map((wt) => ({
        value: wt,
        label: wt,
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Entry" : "Add New Entry"}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Select
                    id="project"
                    label="Select Project *"
                    options={projectOptions}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Project Name"
                    error={errors.project}
                />

                <Select
                    id="typeOfWork"
                    label="Type of Work *"
                    options={workTypeOptions}
                    value={typeOfWork}
                    onChange={(e) => setTypeOfWork(e.target.value)}
                    placeholder="Select type"
                    error={errors.typeOfWork}
                />

                <div>
                    <label
                        htmlFor="taskDescription"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Task description *
                    </label>
                    <textarea
                        id="taskDescription"
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none hover:border-gray-400"
                        placeholder="Write it here ..."
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    {errors.taskDescription && (
                        <p className="mt-1 text-xs text-red-600">{errors.taskDescription}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">A note for extra info</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Hours *
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setHours(Math.max(1, hours - 1))}
                            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            <MinusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <input
                            type="number"
                            min="1"
                            max="24"
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="w-16 text-center px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            onClick={() => setHours(Math.min(24, hours + 1))}
                            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                    {errors.hours && (
                        <p className="mt-1 text-xs text-red-600">{errors.hours}</p>
                    )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" isLoading={isSubmitting} className="flex-1">
                        {isEditing ? "Update entry" : "Add entry"}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
