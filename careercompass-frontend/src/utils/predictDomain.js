const predictDomain = (answers) => {
  const scoreMap = {
    software: 0,
    ai: 0,
    data: 0,
    web: 0,
    cyber: 0,
    cloud: 0,
    devops: 0,
    uiux: 0,
    ba: 0,
  };

Object.values(answers).forEach((ans) => {
    if (scoreMap[ans] !== undefined) {
      scoreMap[ans] += 1;
    }
  });

  const topDomainKey = Object.keys(scoreMap).reduce(
    (a, b) => (scoreMap[a] > scoreMap[b] ? a : b)
  );

  const domainNames = {
    software: "Software Development",
    ai: "AI / Machine Learning",
    data: "Data Science",
    web: "Web Development",
    cyber: "Cybersecurity",
    cloud: "Cloud",
    devops: "DevOps",
    uiux: "UI/UX Design",
    ba: "Business Analyst",
  };

  return {
    domain: domainNames[topDomainKey],
    score: scoreMap[topDomainKey],
  };
};

export default predictDomain;
