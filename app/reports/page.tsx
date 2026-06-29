"use client";

import { useState, useEffect } from 'react';

interface Report {
  tribunalName: string;
  tribunalUrl: string;
  problemType: string;
  timestamp: string;
  status: string; // 'pending', 'resolved', etc.
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/get-reports'); // Endpoint para buscar reports
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
  }, []);

  if (loading) {
    return <div className="text-white text-center p-8">Carregando relatórios...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Relatório de Falhas Reportadas</h1>

      {reports.length === 0 ? (
        <p className="text-white">Nenhum problema foi reportado ainda.</p>
      ) : (
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
    </div>
  );
}
