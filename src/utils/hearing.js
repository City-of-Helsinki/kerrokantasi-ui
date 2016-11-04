import _ from 'lodash';


export function getMainSection(hearing) {
  return _.find(hearing.sections, (section) => section.type === "main");
}

/*
* Return URL to hearing view. Accepts optional fullscreen parameter
* to force fullscreen query parameter.
 */
export function getHearingURL(hearing, {fullscreen} = {}) {
  const url = `/hearing/${hearing.slug}`;
  let query = "";
  if (typeof fullscreen !== "undefined") {
    query = `?fullscreen=${fullscreen}`;
  } else if (hearing.default_to_fullscreen) {
    // Hearing should always have default_to_fullscreen param
    query = "?fullscreen=true";
  }
  return `${url}${query}`;
}


/*
* Returns true if hearing has a plugin that can be rendered fullscreen
* else false.
 */
export function hasFullscreenMapPlugin(hearing) {
  // For now, fullscreen is supported only on map-questionnaire
  return getMainSection(hearing).plugin_identifier === "map-questionnaire";
}

/*
* Returns true if comments are still accepted for the hearing
* else false.
 */
export function acceptsComments(hearing) {
  return !hearing.closed && (new Date() < new Date(hearing.close_at));
}
