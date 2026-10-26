import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculadoraPlantio } from "@/components/CalculadoraPlantio";
import culturasData from "@/data/culturas.json";
import { Cultura } from "@/lib/recommendation/types";
import { DetalheCulturaCliente } from "./DetalheCulturaCliente";

const culturas = culturasData as Cultura[];

export default async function PaginaCultura({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cultura = culturas.find((c) => c.id === id);

  if (!cultura) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1f291e] pb-16">
      <header className="bg-[#244227] text-white py-5 px-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[#d4e4d5] hover:text-white flex items-center gap-1.5 min-h-[44px]"
          >
            <span>←</span>
            <span>Voltar ao início</span>
          </Link>
          <span className="text-xs uppercase tracking-wider font-semibold bg-[#1a301c] px-3 py-1 rounded-full text-[#d4e4d5]">
            {cultura.categoria}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Cabeçalho da Cultura */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e4df] shadow-xs space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f291e]">
            {cultura.nome}
          </h1>
          <p className="text-base text-[#474542] leading-relaxed">
            {cultura.descricao_curta}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#f0ede8] text-center text-xs">
            <div>
              <span className="block text-[#7a7772]">Dificuldade</span>
              <span className="font-semibold text-[#1f291e]">
                {cultura.dificuldade === 1
                  ? "Muito fácil"
                  : cultura.dificuldade === 2
                  ? "Fácil"
                  : "Média"}
              </span>
            </div>
            <div>
              <span className="block text-[#7a7772]">Colheita</span>
              <span className="font-semibold text-[#1f291e]">
                {cultura.dias_ate_colheita[0]}-{cultura.dias_ate_colheita[1]} dias
              </span>
            </div>
            <div>
              <span className="block text-[#7a7772]">Sol mínimo</span>
              <span className="font-semibold text-[#1f291e]">
                {cultura.sol_horas_min}h / dia
              </span>
            </div>
          </div>

          <div className="bg-[#f7f5f2] rounded-xl p-3.5 text-sm text-[#3b3a37]">
            <strong className="text-[#244227]">Dica prática de ouro: </strong>
            {cultura.dica_iniciante}
          </div>

          <DetalheCulturaCliente cultura={cultura} />
        </div>

        {/* O que você vai precisar (Lista de Compras) */}
        {cultura.materiais_iniciais.length > 0 && (
          <section className="bg-white rounded-2xl p-6 border border-[#e8e4df] shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#1f291e] flex items-center gap-2">
              <span>🛒</span>
              <span>O que você vai precisar para começar</span>
            </h2>
            <ul className="space-y-2 text-sm text-[#474542]">
              {cultura.materiais_iniciais.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#244227] font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Calculadora de Espaço e Quantidade */}
        <CalculadoraPlantio cultura={cultura} />

        {/* Linha do Tempo das Fases do Cultivo */}
        {cultura.fases.length > 0 && (
          <section className="bg-white rounded-2xl p-6 border border-[#e8e4df] shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#1f291e] flex items-center gap-2">
              <span>🌱</span>
              <span>Fases da Jornada (do plantio à colheita)</span>
            </h2>
            <div className="space-y-4 border-l-2 border-[#244227] pl-4 ml-2">
              {cultura.fases.map((fase) => (
                <div key={fase.id} className="space-y-1.5 relative">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#1f291e]">{fase.nome}</h3>
                    <span className="text-xs bg-[#eef5ee] text-[#244227] font-semibold px-2 py-0.5 rounded-full">
                      Dias {fase.dias_inicio} a {fase.dias_fim}
                    </span>
                  </div>
                  <p className="text-xs text-[#57544f] italic">
                    Observar: {fase.o_que_observar}
                  </p>
                  <div className="bg-[#fcfbfa] p-3 rounded-xl border border-[#eeebe6] text-xs space-y-1">
                    {fase.tarefas.map((t) => (
                      <div key={t.titulo}>
                        <strong className="text-[#244227]">• {t.titulo}: </strong>
                        <span>{t.como_fazer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pragas Comuns e Soluções Caseiras */}
        {cultura.pragas_comuns.length > 0 && (
          <section className="bg-white rounded-2xl p-6 border border-[#e8e4df] shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#1f291e] flex items-center gap-2">
              <span>🐛</span>
              <span>Pragas comuns e soluções caseiras</span>
            </h2>
            <div className="space-y-3">
              {cultura.pragas_comuns.map((praga) => (
                <div
                  key={praga.nome}
                  className="bg-[#fcfbfa] p-3.5 rounded-xl border border-[#eeebe6] text-xs space-y-1"
                >
                  <span className="font-bold text-sm text-[#8c3f2b] block">
                    {praga.nome}
                  </span>
                  <p>
                    <strong>Sintomas: </strong>
                    {praga.sintomas}
                  </p>
                  <p>
                    <strong className="text-[#244227]">Solução caseira: </strong>
                    {praga.solucao_caseira}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Aviso de segurança para pets e crianças */}
        {cultura.aviso_seguranca && (
          <section className="bg-[#fff9eb] rounded-2xl p-5 border border-[#f7e0a3] text-xs text-[#6e490e] space-y-1">
            <strong className="text-sm text-[#875a12] flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Cuidado com crianças e animais domésticos</span>
            </strong>
            <p className="leading-relaxed">{cultura.aviso_seguranca}</p>
          </section>
        )}

        {/* Rodapé com fontes */}
        <p className="text-xs text-[#7a7772] text-center">
          Referências de cultivo: {cultura.fontes.join(", ")}.
          {cultura.verificar
            ? " Ficha com revisão agronômica pendente (verificar: true)."
            : ""}
        </p>
      </main>
    </div>
  );
}
