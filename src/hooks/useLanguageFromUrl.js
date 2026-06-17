import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { setLanguage } from '../actions';
import { parseQuery } from '../utils/urlQuery';
import config from '../config';

const useLanguageFromUrl = (onChangeLanguage) => {
  const dispatch = useDispatch();
  const { search } = useLocation();

  useEffect(() => {
    const lang = parseQuery(search).lang;
    if (lang && config.languages.includes(lang)) {
      dispatch(setLanguage(lang));
      onChangeLanguage(lang);
    }
  }, [search, dispatch, onChangeLanguage]);
};

export default useLanguageFromUrl;
