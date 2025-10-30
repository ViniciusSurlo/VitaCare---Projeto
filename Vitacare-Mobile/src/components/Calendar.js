import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import moment from 'moment'
import Date from './Date'
import 'moment/locale/pt-br' // importa português

const Calendar = ({ onSelectDate, selected }) => {
    moment.locale('pt-br') // define português como padrão

  const [dates, setDates] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentMonth, setCurrentMonth] = useState()

  // pega as proximas 10 datas apartir de hoje
  const getDates = () => {
    const _dates = []
    for (let i = 0; i < 10; i++) {
      const date = moment().add(i, 'days')
      _dates.push(date)
    }
    setDates(_dates)
  }

  useEffect(() => {
    getDates()
  }, [])

/**

* scrollPosition é o número de pixels que o usuário rolou a tela
* Dividimos por 60 porque cada data tem 80 pixels de largura e queremos obter o número de datas
* Adicionamos o número de datas à data de hoje para obter o mês atual
* Formatamos o resultado como uma string e o definimos como currentMonth
*/
const getCurrentMonth = () => {
  const month = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM')
  setCurrentMonth(month.charAt(0).toUpperCase() + month.slice(1)) // coloca a primeira letra maiúscula
}

  useEffect(() => {
    getCurrentMonth()
  }, [scrollPosition])

  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View>
      <View style={styles.dateSection}>
        <View style={styles.scroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // onScroll é um evento nativo que retorna o número de pixels que o usuário rolou a página.
            onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
            scrollEventThrottle={16}
          >
            {dates.map((date, index) => (
              <Date
                key={index}
                date={date}
                onSelectDate={onSelectDate}
                selected={selected}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Calendar

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateSection: {
    width: '100%',
    padding: 20,
  },
  scroll: {
    height: 150,
  },
})