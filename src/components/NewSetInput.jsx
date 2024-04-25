import { View, StyleSheet, Button, TextInput, Text } from "react-native";
import { useState } from "react";
import { gql } from "graphql-request";
import { useMutation } from "@tanstack/react-query";
import graphqlClient from "../graphqlClient";

const mutationDocument = gql`
  mutation MyMutation($newSet: NewSet!) {
    insertSet(
      document: $newSet
      collection: "sets"
      database: "Workouts"
      dataSource: "Cluster0"
    ) {
      insertedId
    }
  }
`;

const NewSetInput = ({ exerciseName }) => {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const { mutate, error, isError, isPending } = useMutation({
    mutationFn: (newSet) => graphqlClient.request(mutationDocument, { newSet }),
  });

  const addSet = () => {
    console.warn("Add set: ", reps, weight);

    const newSet = {
      exercise: exerciseName,
      reps: Number.parseInt(reps),
    };
    if (Number.parseFloat(weight)) {
      newSet.weight = Number.parseFloat(weight);
    }
    mutate(newSet);

    setReps("");
    setWeight("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          value={reps}
          onChangeText={setReps}
          placeholder="Reps"
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Weight"
          style={styles.input}
          keyboardType="numeric"
        />
        <Button title={isPending ? "Adding..." : "Add"} onPress={addSet} />
      </View>
      {isError && <Text style={{ color: "red" }}>Failed to add set</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    gap: 5,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gainsboro",
    padding: 10,
    flex: 1,
    borderRadius: 5,
  },
});

export default NewSetInput;
