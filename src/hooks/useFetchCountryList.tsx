import {Country, CountryResponse} from '@/types/Types';
import {urls} from '@/utils/constants.json';
import {useEffect, useState} from 'react';

export const useFetchCountryList = (): [
  boolean,
  boolean,
  Country[] | undefined,
] => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<Country[]>();

  const prepareCountryListArray = (responseObj: CountryResponse): void => {
    const keys = Object.keys(responseObj);
    const countries: Country[] = [];
    keys.forEach((key: string) => {
      const country: Country = {
        name: key,
        players: responseObj[key],
      };
      countries.push(country);
    });
    setCountryList(countries);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(urls.fetchCountries)
      .then(res => res.json())
      .then((res: CountryResponse) => {
        setIsLoading(false);
        setIsError(false);
        prepareCountryListArray(res);
      })
      .catch(e => {
        console.warn(e);
        setIsError(true);
        setIsLoading(false);
        prepareCountryListArray({});
      });
  }, []);

  return [isLoading, isError, countryList];
};
