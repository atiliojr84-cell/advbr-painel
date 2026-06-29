"use client";

import { useState, useEffect } from 'react';
import Modal from "./ui/Modal"; // Importa o Modal atualizado

interface Report {
  tribunalName: string;
  tribunalUrl: string;
  problemType: string;
  timestamp: string;
  status: string; // 'pending', 'resolved', etc.
}

interface ReportsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportsViewerModal({ isOpen, onClose }: ReportsViewerModalProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return; // Só busca os reports se o modal estiver aberto

    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/get-reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports);
        } else {
          const errorData = await response.json();
          setError(`Erro ao carregar relatórios: ${errorData.error || response.statusText}`);
        }
      } catch (err) {
        setError(`Erro de conexão: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [isOpen]); // Dependência do isOpen para buscar quando o modal abre

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Relatório de Falhas Reportadas">
      {loading && <div className="text-white text-center p-8">Carregando relatórios...</div>}
      {error && <div className="text-red-500 text-center p-8">Erro: {error}</div>}

      {!loading && !error && reports.length === 0 && (
        <p className="text-white">Nenhum problema foi reportado ainda.</p>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="py-2 px-4 text-left">Tribunal</th>
                <th className="py-2 px-4 text-left">Problema</th>
                <th className="py-2 px-4 text-left">Data/Hora</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="border-b border-slate-600 text-white hover:bg-slate-700">
                  <td className="py-2 px-4">{report.tribunalName}</td>
                  <td className="py-2 px-4">{report.problemType}</td>
                  <td className="py-2 px-4">{new Date(report.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'pending' ? 'bg-yellow-500 text-yellow-900' :
                      report.status === 'resolved' ? 'bg-green-500 text-green-900' :
                      'bg-gray-500 text-gray-900'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
