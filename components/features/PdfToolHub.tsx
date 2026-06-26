{selectedTool && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-white text-xl font-bold mb-4">{selectedTool.title}</h3>
              <p className="text-slate-300 leading-relaxed mb-6">{selectedTool.help}</p>
              
              {selectedTool.id !== "unir" && selectedTool.id !== "converter" && (
                <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} 
                  className="w-full p-4 mb-6 bg-slate-950 text-white rounded-xl border border-slate-700" 
                  placeholder={selectedTool.id === "dividir" ? "Tamanho (MB)" : selectedTool.id === "comprimir" ? "DPI (600/200/100)" : "Senha"} />
              )}
              
              <div className="flex gap-4">
                <button onClick={() => setSelectedTool(null)} className="flex-1 py-3 text-slate-400">Cancelar</button>
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white">Processar</button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
