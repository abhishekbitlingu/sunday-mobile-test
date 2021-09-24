import {
  Player,
  PlayerListProps,
  PlayerListScreenNavigationProp,
  PlayerListScreenRouteProp,
  RadioButtonOption,
} from '@/types/Types';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  colors,
  overlayRadioPopupMenuKeys,
  overlayRadioPopupMenuLabels,
} from '@/utils/constants.json';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AppUtilities from '@/utils/AppUtilities';
import {OverlayRadioButtons} from '@/components/common/OverlayRadioButtons';

const styles = StyleSheet.create({
  shadowContainerStyle: {
    margin: 10,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  countrynametext: {
    flex: 1,
    fontSize: 18,
    padding: 10,
  },
  captainText: {
    fontSize: 18,
    paddingHorizontal: 15,
  },
  flatlist: {
    marginBottom: 36,
  },
  drawerNavRightButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  sortText: {
    color: colors.uiYellow,
    paddingHorizontal: 5,
    fontWeight: '600',
  },
});

export const PlayerList: React.FC<PlayerListProps> = (): JSX.Element => {
  const [sortOptionSelected, setSortOptionSelected] = useState<number>(0);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const navigation = useNavigation<PlayerListScreenNavigationProp>();
  const route = useRoute<PlayerListScreenRouteProp>();
  const [players, setPlayers] = useState<Player[]>([]);

  const getSortedPlayers = useCallback(
    (data: Player[]): Player[] => {
      let sortedData: Player[];
      switch (sortOptionSelected) {
        case 0:
          sortedData = data.sort((item1, item2) =>
            AppUtilities.compare(item1.name, item2.name),
          );
          return sortedData;
        case 1:
          sortedData = data
            .sort((item1, item2) =>
              AppUtilities.compare(item1.name, item2.name),
            )
            .reverse();
          return sortedData;
        default:
          return data;
      }
    },
    [sortOptionSelected],
  );

  const sortOptions: RadioButtonOption[] = useMemo(() => {
    return [
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
  }, []);

  useEffect(() => {
    let sortedData: Player[] = [];
    const data = getSortedPlayers(route.params.players);
    sortedData = sortedData.concat(data);
    setPlayers(sortedData);
  }, [getSortedPlayers, route.params.players, sortOptionSelected]);

  const onOptionSelected = (selectedOption: RadioButtonOption) => {
    setIsOverlayVisible(false);
    setSortOptionSelected(selectedOption.value);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.headerTitle,
      headerRight: () => (
        <TouchableOpacity
          style={styles.drawerNavRightButton}
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
      ),
    });
  }, [
    navigation,
    route.params.headerTitle,
    route.params.players,
    sortOptionSelected,
    sortOptions,
  ]);

  const renderPlayerListItem: ListRenderItem<Player> = ({
    item,
  }): JSX.Element => {
    return (
      <View
        style={[
          styles.shadowContainerStyle,
          {backgroundColor: item.captain ? colors.uiYellow : colors.uiWhite},
        ]}>
        <Text
          style={[
            styles.countrynametext,
            {
              color: item.captain ? colors.uiWhite : colors.uiBlack,
            },
          ]}>
          {item.name}
        </Text>
        {item.captain && (
          <Text
            style={[
              styles.captainText,
              {
                color: item.captain ? colors.uiWhite : colors.uiBlack,
              },
            ]}>
            Captain
          </Text>
        )}
      </View>
    );
  };

  const keyExtractor = (_item: Player): string => _item.name.toLowerCase();

  return (
    <View>
      <OverlayRadioButtons
        isVisible={isOverlayVisible}
        options={sortOptions}
        selectedOption={sortOptionSelected}
        onOptionSelected={onOptionSelected}
        onCancel={() => {
          setIsOverlayVisible(false);
        }}
      />
      <FlatList
        key={players.length}
        style={styles.flatlist}
        data={players}
        renderItem={renderPlayerListItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};
