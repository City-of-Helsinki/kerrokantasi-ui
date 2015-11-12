// Init to be run both on server and client

import {addLocaleData} from 'react-intl';
import en from 'react-intl/lib/locale-data/en';
import fi from 'react-intl/lib/locale-data/fi';
import sv from 'react-intl/lib/locale-data/sv';

let done = false;

export default function() {
  if (done) return;
  addLocaleData(en);
  addLocaleData(fi);
  addLocaleData(sv);
  done = true;
}
