import { NextResponse } from 'next/server';

export async function GET() {
  // Retornaremos um dado estático primeiro para ver se o seu painel "acorda"
  return NextResponse.json({ 
    noticias: [
      { texto: "Sistema em manutenção: estamos atualizando os feeds.", url: "#" },
      { texto: "ADVBR.INFO: Suporte Jurídico de Elite.", url: "#" }
    ] 
  });
}      } catch (e) {
        console.error(`Erro ao buscar ${feed.fonte}:`, e);
      }
    }

    return NextResponse.json({ noticias: resultadosTotais });
  } catch (error) {
    return NextResponse.json({ noticias: [] }, { status: 500 });
  }
}
