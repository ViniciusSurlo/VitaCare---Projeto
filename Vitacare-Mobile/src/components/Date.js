import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import moment from "moment";
import "moment/locale/pt-br"; // importa português

const Date = ({ date, onSelectDate, selected }) => {
  moment.locale("pt-br"); // define português como padrão

  //função para armazenar o valor do dia (segunda, terça...)
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "Hoje"
      : moment(date).format("ddd");

  //para armazenar o numero do dia (1,2,3...)
  const dayNumber = moment(date).format("D");

  // pegar a data inteira (a gente usa pra comparar com a dataSelecionada)
  const fullDate = moment(date).format("YYYY-MM-DD");

  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[
        styles.card,
        selected === fullDate && { backgroundColor: "#6146c6" },
      ]}
    >
      <Text style={[styles.big, selected === fullDate && { color: "#fff" }]}>
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[
          styles.medium,
          selected === fullDate && {
            color: "#fff",
            fontWeight: "bold",
            fontSize: 24,
          },
        ]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
};

export default Date;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    borderRadius: 10,
    borderColor: "#ddd",
    padding: 10,
    alignItems: "center",
    height: 90,
    width: 80,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: "bold",
    fontSize: 20,
  },
  medium: {
    fontSize: 16,
  },
});
