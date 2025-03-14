import React from 'react';
import { CookieModal } from 'hds-react';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import settings from '@city-assets/settings.json';

import { getHDSCookieConfig } from '../../utils/cookieUtils';
import { setLanguage as setLanguageDispatch } from '../../actions';

function CookieBar() {
  const dispatch = useDispatch();
  const siteName = settings.meta.title || 'Kerrokantasi';
  const language = useSelector((state) => state.language);
  const setLanguage = (newLocale) => dispatch(setLanguageDispatch(newLocale));
  const getCookieModalConfig = () => getHDSCookieConfig(siteName, language, setLanguage);

  return <CookieModal contentSource={getCookieModalConfig()} />;
}

export default CookieBar;
