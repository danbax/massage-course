import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

function GAListener() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: pathname + search });
  }, [pathname, search]);
  return null;
}

export default GAListener;
