import React from 'react';
import { CookieModal } from 'hds-react';

import { getHDSCookieConfig } from '../../utils/cookieUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage as setLanguageDispatch } from '../../actions';

function CookieBar() {
  const dispatch = useDispatch();
  const siteName = document.querySelector("meta[property='og:title']").getAttribute('content');
  const language = useSelector(state => state.language)
  const setLanguage = (newLocale) => dispatch(setLanguageDispatch(newLocale));
  const getCookieModalConfig = () => getHDSCookieConfig(siteName, language, setLanguage);

  return <CookieModal contentSource={getCookieModalConfig()} />;
}

export default CookieBar;
