import { defineRailway, github, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    source: github("yyaskriloff/abi"),
  });

  return project("abi", {
    resources: [web],
  });
});
