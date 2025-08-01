 import React from "react";
import EmployeeSidebar from "../../Component/EMPDashboard/EmployeeSidebar";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const EmployeeLayout = ({ children, user }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-purple-100 via-blue-50 to-white">
      <EmployeeSidebar user={user} />
      <main className="flex-1 p-8 md:p-14 bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white/95 rounded-3xl shadow-2xl p-10 md:p-16 min-h-[70vh] border-2 border-indigo-100 backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;