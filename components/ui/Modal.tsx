"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // Mantemos o title, pois é útil para o cabeçalho
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Fecha o modal ao clicar no backdrop
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            key="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Impede que o clique no conteúdo feche o modal
            className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] border border-slate-800"
          >
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="text-white text-xl font-bold">{title}</h3>
              <button onClick={onClose} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain max-h-[60vh] pr-2 -mr-2 custom-scrollbar scroll-smooth">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
