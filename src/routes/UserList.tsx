import {getAllUsers, getDBConnection} from '@/local-storage/SQLiteHelper';
import {User, UserListProps} from '@/types/Types';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '@/utils/constants.json';
import LoadingIndicator from '@/components/common/LoadingIndicator';

const styles = StyleSheet.create({
  shadowContainerStyle: {
    margin: 10,
    padding: 6,
    backgroundColor: colors.uiWhite,
    borderRadius: 5,
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
  fullNameTest: {
    flex: 1,
    fontSize: 18,
    padding: 3,
  },
  emailText: {
    padding: 3,
    fontSize: 15,
  },
  flatlist: {
    marginBottom: 36,
  },
});

export const UserList: React.FC<UserListProps> = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const db = await getDBConnection();
        const results = await getAllUsers(db);
        setIsLoading(false);
        setUserList(results);
      } catch {
        setIsLoading(false);
        setUserList([]);
      }
    };
    fetchUsers();
  }, []);

  const renderUserItem: ListRenderItem<User> = useCallback(
    ({item}): JSX.Element => {
      return (
        <View style={styles.shadowContainerStyle}>
          <Text style={styles.fullNameTest}>{item.name}</Text>
          <Text style={styles.emailText}>{item.email}</Text>
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback(
    (_item: User): string => _item.email.toLowerCase(),
    [],
  );
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <FlatList
      style={styles.flatlist}
      data={userList}
      renderItem={renderUserItem}
      keyExtractor={keyExtractor}
    />
  );
};
