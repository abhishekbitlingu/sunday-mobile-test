import {CountryListItem} from '@/components/common/CountryListItem';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import {OverlayRadioButtons} from '@/components/common/OverlayRadioButtons';
import {SearchBox} from '@/components/common/SearchBox';
import {useFetchCountryList} from '@/hooks/useFetchCountryList';
import {
  RadioButtonOption,
  CountryListProps,
  CountryListScreenNavigationProp,
  Country,
} from '@/types/types';
import AppUtilities from '@/utils/AppUtilities';
import {
  colors,
  overlayRadioPopupMenuKeys,
  overlayRadioPopupMenuLabels,
  strings,
} from '@/utils/constants.json';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/EvilIcons';

const styles = StyleSheet.create({
  noResultsFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: colors.uiYellow,
  },
  container: {
    flex: 1,
    backgroundColor: colors.uiWhite,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        paddingBottom: 36,
      },
      default: {
        marginBottom: 0,
      },
    }),
  },
  searchBoxContainer: {
    marginHorizontal: 7,
    height: 48,
    backgroundColor: colors.uiWhite,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.uiGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sortFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  sortText: {
    color: colors.uiYellow,
    paddingHorizontal: 5,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
});

export const CountryList: React.FC<CountryListProps> = (): JSX.Element => {
  const navigation = useNavigation<CountryListScreenNavigationProp>();
  const [countryList, setCountryList] = useState<Country[]>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOptionSelected, setSortOptionSelected] = useState<number>(0);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [isLoading, isError, countries] = useFetchCountryList();
  const sortOptions: RadioButtonOption[] = [
    {
      key: overlayRadioPopupMenuKeys.sortAscending,
      value: 0,
      label: overlayRadioPopupMenuLabels.sortAscending,
    },
    {
      key: overlayRadioPopupMenuKeys.sortDescending,
      value: 1,
      label: overlayRadioPopupMenuLabels.sortDescending,
    },
  ];

  const handleItemPress = useCallback(
    (country: Country) => {
      navigation.navigate('PlayerList', {
        headerTitle: country.name,
        players: country.players,
      });
    },
    [navigation],
  );

  const renderCountryListItem: ListRenderItem<Country> = useCallback(
    ({item}): JSX.Element => {
      return <CountryListItem onPress={handleItemPress} data={item} />;
    },
    [handleItemPress],
  );

  const EmptyListComponent = (): JSX.Element => (
    <View style={styles.noResultsFoundContainer}>
      <Text style={styles.noResultsText}>{strings.noResultsFound}</Text>
    </View>
  );

  const keyExtractor = useCallback(
    (_item: Country): string => _item.name.toLowerCase(),
    [],
  );

  const filterCountries = (query: string): Country[] | undefined => {
    const filteredData = countries?.filter((item: Country) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
    return filteredData;
  };

  const getSortedCountries = (data?: Country[]): Country[] | undefined => {
    if (!data) {
      return undefined;
    }
    let sortedData: Country[];
    switch (sortOptionSelected) {
      case 0:
        sortedData = data.sort((item1, item2) =>
          AppUtilities.compare(item1.name, item2.name),
        );
        return sortedData;
      case 1:
        sortedData = data
          .sort((item1, item2) => AppUtilities.compare(item1.name, item2.name))
          .reverse();
        return sortedData;
      default:
        return data;
    }
  };

  const handleOnChange = useCallback(
    (value: string, isDelayed?: boolean): void => {
      if (isDelayed) {
        setSearchQuery(value);
      }
    },
    [],
  );

  useEffect(() => {
    const filteredData = filterCountries(searchQuery);
    const sortedData = getSortedCountries(filteredData);
    setCountryList(sortedData); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOptionSelected, countries, searchQuery]);

  const onOptionSelected = useCallback((selectedOption: RadioButtonOption) => {
    setSortOptionSelected(selectedOption.value);
    setIsOverlayVisible(false);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchBoxContainer}>
          <SearchBox
            onChange={handleOnChange}
            placeHolderText={strings.searchBarPlaceHolder}
            iconComponent={
              <Icon name={'search'} size={36} color={colors.uiGray} />
            }
            deBounce={500}
          />
          <TouchableOpacity
            style={styles.sortFilterButton}
            onPress={() => {
              setIsOverlayVisible(true);
            }}>
            <Text style={styles.sortText}>
              {sortOptions[sortOptionSelected].label}
            </Text>
            <EntypoIcon
              name={'chevron-thin-down'}
              size={20}
              color={colors.uiYellow}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {!isError && (isLoading || !countryList) ? (
            <LoadingIndicator />
          ) : (
            countryList && (
              <FlatList
                data={countryList}
                renderItem={renderCountryListItem}
                keyExtractor={keyExtractor}
                ListEmptyComponent={EmptyListComponent}
              />
            )
          )}
        </View>
        <OverlayRadioButtons
          isVisible={isOverlayVisible}
          options={sortOptions}
          selectedOption={sortOptionSelected}
          onOptionSelected={onOptionSelected}
          onCancel={() => {
            setIsOverlayVisible(false);
          }}
        />
      </View>
    </>
  );
};
