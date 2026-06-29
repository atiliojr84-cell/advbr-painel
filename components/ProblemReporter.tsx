// ... (imports e outras partes do código) ...

  const handleReportSubmit = async () => {
    // A validação do frontend já está lá, mas vamos adicionar um log do que será enviado
    if (!selectedTribunal || !problemType) {
      setSubmitMessage("Erro: Dados incompletos para o reporte (frontend).");
      return;
    }

    setSubmitMessage(null);
    setIsSubmitting(true);

    const reportData = {
      tribunalName: selectedTribunal.name,
      // CORREÇÃO AQUI: Garante que tribunalUrl seja uma string, mesmo que seja null/undefined no objeto original
      tribunalUrl: selectedTribunal.url || '',
      problemType: problemType,
      timestamp: new Date().toISOString(),
    };

    console.log("DEBUG: Dados sendo enviados para a API:", reportData); // Log para o console do navegador

    try {
      const response = await fetch('/api/report-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro desconhecido (${response.status}) ao reportar.`);
      }

      setSubmitMessage("Reporte enviado com sucesso! Agradecemos sua colaboração.");
      // resetModal(); // Decide if you want to close the modal on success
    } catch (error: any) {
      console.error("Erro ao enviar reporte:", error);
      setSubmitMessage(`Erro ao reportar problema: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

// ... (restante do componente) ...
