export function calculateScores({ understanding, awareness, decision, actionability, clarity, evidenceCounts }) {
  console.log('SCORING SERVICE - input values:', {
    understanding,
    awareness,
    decision,
    actionability,
    clarity,
    evidenceCounts
  });

  const capabilityBase =
    0.30 * understanding +
    0.25 * decision +
    0.20 * awareness +
    0.15 * actionability +
    0.10 * clarity;

  console.log('SCORING SERVICE - capability base:', capabilityBase);

  const capabilityIndex = capabilityBase * 20;
  console.log('SCORING SERVICE - capability index:', capabilityIndex);

  const {
    causeCount = 0,
    decisionCount = 0,
    riskCount = 0,
    stakeholderCount = 0,
    actionCount = 0
  } = evidenceCounts || {};

  const totalEvidenceFound =
    causeCount + decisionCount + riskCount + stakeholderCount + actionCount;
  console.log('SCORING SERVICE - total evidence found:', totalEvidenceFound);

  let confidenceIndex = (totalEvidenceFound / 10) * 100;
  console.log('SCORING SERVICE - raw confidence index:', confidenceIndex);

  if (confidenceIndex > 100) {
    confidenceIndex = 100;
    console.log('SCORING SERVICE - confidence index capped at 100');
  }

  const evidenceTypesPresent = [
    causeCount,
    decisionCount,
    riskCount,
    stakeholderCount,
    actionCount
  ].reduce((count, value) => count + (value > 0 ? 1 : 0), 0);
  console.log('SCORING SERVICE - evidence types present:', evidenceTypesPresent);

  const coverageIndex = (evidenceTypesPresent / 5) * 100;
  console.log('SCORING SERVICE - coverage index:', coverageIndex);

  return {
    capabilityIndex,
    confidenceIndex,
    coverageIndex
  };
}
