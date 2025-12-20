const predictDomain = (answers) => {
  const scoreMap = {};

  Object.values(answers).forEach((ans) => {
    const domain = ans.domain;

    if (domain) {
      scoreMap[domain] = (scoreMap[domain] || 0) + 1;
    }
  });

  let maxScore = 0;
  let selectedDomain = null;

  for (const domain in scoreMap) {
    if (scoreMap[domain] > maxScore) {
      maxScore = scoreMap[domain];
      selectedDomain = domain;
    }
  }

  return {
    domain: selectedDomain,
    score: maxScore,
  };
};

export default predictDomain;
