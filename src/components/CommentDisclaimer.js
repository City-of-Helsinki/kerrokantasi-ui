import React from "react";
import {injectIntl, FormattedMessage} from "react-intl";

class CommentDisclaimer extends React.Component {
  render() {
    return (
      <div className="comment-conditions">
        <FormattedMessage
          id="commentConditions"
          values={{
            linkToDefinition: <a href="http://www.hri.fi/fi/mita-on-avoin-data/"target="_blank">
              <FormattedMessage id="asOpenData"/></a>,
            linkToLicense: <a href="http://creativecommons.org/licenses/by/4.0/deed.fi"target="_blank">
              <FormattedMessage id="withOpenLicense"/></a>
          }}
        />
      </div>
    );
  }
}

export default injectIntl(CommentDisclaimer);
