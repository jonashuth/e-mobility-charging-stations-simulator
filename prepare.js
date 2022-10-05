const isCIEnvironment = process.env.CI !== undefined;
const isCFEnvironment = process.env.VCAP_APPLICATION !== undefined;
if (isCFEnvironment === false && isCIEnvironment === false) {
  // eslint-disable-next-line node/no-unpublished-require
  require('husky').install();
}
