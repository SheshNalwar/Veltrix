import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { useBuilder } from "../context/BuilderContext";
import { motion, AnimatePresence } from "framer-motion";
import "../index.css"; // Make sure this imports your CSS where custom-scrollbar styles are defined

interface StepsListProps {
  loading?: boolean;
  buffering?: boolean;
  isLoadingMore?: boolean;
  status?: string;
}

const StepsList: React.FC<StepsListProps> = ({
  loading = false,
  buffering = false,
  isLoadingMore = false,
  status = "Building next steps...",
}) => {
  const { steps } = useBuilder();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 100); // delay to wait for animation/render

    return () => clearTimeout(timeout);
  }, [steps.length, isLoadingMore]);

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Build Steps</h2>
      </div>

      <div
        ref={containerRef}
        className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar rounded-lg">
        <AnimatePresence initial={false}>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start p-3 rounded-lg ${
                step.completed ? "bg-green-900/20" : "bg-gray-800/50"
              }`}>
              <div className="mr-3 mt-0.5">
                {step.completed ? (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepsList;
