// Init to be run both on server and client

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import sv from 'react-intl/locale-data/sv';

let done = false;

export default function () {
  if (done) return;
  addLocaleData(en);
  addLocaleData(fi);
  addLocaleData(sv);
  done = true;
}
