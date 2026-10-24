import {
  Cultura,
  InputRecomendacao,
  ItemRecomendado,
  StatusRecomendacao,
} from "./types";

interface AvaliacaoFator {
  score: number;
  motivo?: string;
  aviso?: string;
  bloqueante?: boolean;
}

function avaliarClima(cultura: Cultura, input: InputRecomendacao): AvaliacaoFator {
  const [tempMinIdeal, tempMaxIdeal] = cultura.temp_ideal_c;
  const { min: tempMinRisco, max: tempMaxRisco } = cultura.temp_risco_c;
  const temp = input.temperatura_media_c;
  const mesNaJanela = cultura.meses_plantio_geral.includes(input.mes);

  if (temp < tempMinRisco) {
    return {
      score: 10,
      aviso: `Frio excessivo para esta planta (temperatura mínima segura: ${tempMinRisco}°C).`,
      bloqueante: true,
    };
  }

  if (temp > tempMaxRisco) {
    return {
      score: 10,
      aviso: `Calor excessivo para esta planta (temperatura máxima segura: ${tempMaxRisco}°C).`,
      bloqueante: true,
    };
  }

  const dentroIdeal = temp >= tempMinIdeal && temp <= tempMaxIdeal;

  if (dentroIdeal && mesNaJanela) {
    return {
      score: 100,
      motivo: "Clima atual na faixa ideal de temperatura e época recomendada.",
    };
  }

  if (dentroIdeal && !mesNaJanela) {
    return {
      score: 75,
      aviso: "Temperatura favorável, mas fora do período clássico de semeadura.",
    };
  }

  return {
    score: 55,
    aviso: `Temperatura aceitável (${temp}°C), mas fora da faixa ideal (${tempMinIdeal}°C a ${tempMaxIdeal}°C).`,
  };
}

function avaliarEspaco(cultura: Cultura, input: InputRecomendacao): AvaliacaoFator {
  if (input.tipo_espaco === "vaso") {
    if (!cultura.espaco.permite_vaso || !cultura.espaco.permite_apartamento) {
      return {
        score: 0,
        aviso: "Não recomendado para plantio em vasos ou espaços confinados.",
        bloqueante: true,
      };
    }

    const litrosMin = cultura.espaco.vaso_litros_min ?? 5;
    return {
      score: 95,
      motivo: `Adapta-se muito bem a vasos (mínimo de ${litrosMin} litros por planta).`,
    };
  }

  return {
    score: 100,
    motivo: "Excelente aproveitamento para canteiros e quintais com espaço aberto.",
  };
}

function avaliarSol(cultura: Cultura, input: InputRecomendacao): AvaliacaoFator {
  const diferenca = input.sol_horas - cultura.sol_horas_min;

  if (diferenca >= 0) {
    return {
      score: 100,
      motivo: `Luz solar suficiente (recebe ${input.sol_horas}h/dia; mínimo exigido: ${cultura.sol_horas_min}h).`,
    };
  }

  if (diferenca === -1) {
    return {
      score: 60,
      aviso: `Luz ligeiramente abaixo do ideal (exige ${cultura.sol_horas_min}h/dia; pode crescer mais devagar).`,
    };
  }

  return {
    score: 10,
    aviso: `Insolação insuficiente (exige pelo menos ${cultura.sol_horas_min}h de sol direto por dia).`,
    bloqueante: true,
  };
}

function avaliarFacilidade(cultura: Cultura): number {
  const map: Record<number, number> = { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20 };
  return map[cultura.dificuldade] ?? 50;
}

function avaliarRapidez(cultura: Cultura): number {
  const diasMedios = (cultura.dias_ate_colheita[0] + cultura.dias_ate_colheita[1]) / 2;
  if (diasMedios <= 40) return 100;
  if (diasMedios <= 65) return 80;
  if (diasMedios <= 90) return 60;
  return 40;
}

export function classificarCultura(
  cultura: Cultura,
  input: InputRecomendacao
): ItemRecomendado {
  const clima = avaliarClima(cultura, input);
  const espaco = avaliarEspaco(cultura, input);
  const sol = avaliarSol(cultura, input);
  const facilidade = avaliarFacilidade(cultura);
  const rapidez = avaliarRapidez(cultura);

  const motivos: string[] = [];
  const avisos: string[] = [];

  if (clima.motivo) motivos.push(clima.motivo);
  if (clima.aviso) avisos.push(clima.aviso);
  if (espaco.motivo) motivos.push(espaco.motivo);
  if (espaco.aviso) avisos.push(espaco.aviso);
  if (sol.motivo) motivos.push(sol.motivo);
  if (sol.aviso) avisos.push(sol.aviso);

  if (cultura.dificuldade === 1) {
    motivos.push("Manejo muito fácil e tolerante a pequenos erros de iniciantes.");
  }

  const pontuacao = Math.round(
    clima.score * 0.5 +
      facilidade * 0.25 +
      espaco.score * 0.15 +
      rapidez * 0.1
  );

  let status: StatusRecomendacao = "nao_recomendado";

  if (espaco.bloqueante || sol.bloqueante) {
    status = "nao_recomendado";
  } else if (clima.bloqueante) {
    status = "esperar";
    avisos.push("Melhor aguardar a estação com temperatura mais adequada.");
  } else if (pontuacao >= 75) {
    status = "ideal_agora";
  } else if (pontuacao >= 50) {
    status = "possivel";
  } else {
    status = "esperar";
  }

  return {
    cultura,
    status,
    pontuacao,
    motivos,
    avisos,
  };
}

export function gerarRecomendacoes(
  culturas: Cultura[],
  input: InputRecomendacao
): ItemRecomendado[] {
  const avaliadas = culturas.map((c) => classificarCultura(c, input));

  const ordemStatus: Record<StatusRecomendacao, number> = {
    ideal_agora: 1,
    possivel: 2,
    esperar: 3,
    nao_recomendado: 4,
  };

  return avaliadas.sort((a, b) => {
    const statusDiff = ordemStatus[a.status] - ordemStatus[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.pontuacao - a.pontuacao;
  });
}
