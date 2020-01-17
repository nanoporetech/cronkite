const tasks = arr => arr.join(" && ");

module.exports = {
  hooks: {
    "pre-commit": tasks(["npm run build:docs && npm run lint"]),
    "pre-push": tasks(["CI=true npm test"])
  }
};
