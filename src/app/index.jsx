import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import ExerciseListItem from "../components/ExerciseListItem";
import { useInfiniteQuery, isFetchingNextPage } from "@tanstack/react-query";
import { gql } from "graphql-request";
import client from "../graphqlClient";
import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthContext";


const exercisesQuery = gql`
  query exercises($muscle: String, $name: String, $offset: Int) {
    exercises(muscle: $muscle, name: $name, offset: $offset) {
      name
      muscle
      equipment
    }
  }
`;

export default function ExercisesScreen() {
  const { data, isLoading, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["exercises"],
    queryFn: ({ pageParam }) =>
      client.request(exercisesQuery, { offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => pages.length * 10,
  });

  const { username } = useAuth();

  const loadMore = () => {
    if (isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch exercises</Text>;
  }
  if (!username) {
    return <Redirect href={"/auth"}></Redirect>;
  }

  const exercises = data?.pages.flatMap((page) => page.exercises);

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        contentContainerStyle={{ gap: 5 }}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => <ExerciseListItem item={item} />}
        onEndReachedThreshold={1}
        onEndReached={loadMore}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});
