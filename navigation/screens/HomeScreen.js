import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CommonDataManager from '../../components/CommonDataManager';
import MiniPlayer from '../../components/MiniPlayer';
import SoundHandler from '../../components/SoundHandler';

export function HomeScreen({ navigation}) {

  const [channels, setChannels] = useState([])
  const [favorites, setFavorites] = useState([])
  const [refresh, setRefresh] = useState([true])
  const [filter, setFilter] = useState(0)
  const soundManager = new SoundHandler()

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen was focused');

      getData()
     
    }, [])
  );

  useEffect(() => {
    fetchList2("Rikskanal")
    getData()
  }, [])

  useEffect(() => {
    storeData(favorites)
  }, [favorites])

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      let commonFav = CommonDataManager.getInstance()
      let ids = value.map(item => item.id)
      commonFav.setFavIds(ids)
      setRefresh({
        refresh: !refresh
      })
      await AsyncStorage.setItem('idArray', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('idArray');
      let json = JSON.parse(jsonValue)
      let commonFav = CommonDataManager.getInstance()
      let ids = json.map(item => item.id)
      commonFav.setFavIds(ids)
      setFavorites(json);
    } catch (e) {
      console.log(e)
    }
  }

  const addFavorite = (item) => {
    let ids = favorites.map(o => o.id)
    if (!ids.includes(item.id)) {
      setFavorites([...favorites, item])
      console.log("added " + item.id)
    } else {
      setFavorites(favorites.filter(e => e.id != item.id))
      console.info("deleted item " + item.id + " from " + favorites)
    }
  }

  const fetchList2 = async (channeltype) => {
    try {
      let response = await fetch(`https://api.sr.se/api/v2/channels?format=json&pagination=false&filter=channel.channeltype&filtervalue=${channeltype}`)
      let json = await response.json();
      setChannels(json.channels)

      return json;
    } catch (error) {
      console.error(error);
    }
  }


  return (

    <View style={styles.container}>

      <View style={styles.filterButtons}>
        <Pressable style={styles.button} onPress={() => {
          fetchList2("Rikskanal")
          setFilter(0)
        }}>
          <Text style={{ color: filter === 0 ? 'black' : 'gray', fontWeight: filter === 0 ? 'bold' : 'normal' }}>Rikskanaler</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {
          fetchList2("Lokal%20kanal")
          setFilter(1)
        }}>
          <Text style={{ color: filter === 1 ? 'black' : 'gray', fontWeight: filter === 1 ? 'bold' : 'normal' }}>Lokala kanaler</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {
          fetchList2("Minoritet%20och%20spr&aring;k")
          setFilter(2)
        }}>
          <Text style={{ color: filter === 2 ? 'black' : 'gray', fontWeight: filter === 2 ? 'bold' : 'normal' }}>Minoritet & språk</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {
          fetchList2("Fler%20kanaler")
          setFilter(4)
        }}>
          <Text style={{ color: filter === 4 ? 'black' : 'gray', fontWeight: filter === 4 ? 'bold' : 'normal' }}>Fler kanaler</Text>
        </Pressable>
      </View>
      <FlatList
        style={styles.flatlist}
        data={channels}
        extraData={
          refresh
        }
        renderItem={({ item }) => (
          <Card item={item} playRadio={(live) => { soundManager.playRadio(item, live), setRefresh({ refresh: !refresh }) }}
            addFavorite={() => addFavorite(item)} 
              onPress={ (schedule) => {
                navigation.navigate('PlayScreen', { item: item, schedule: schedule })
              }
            } />
        )}
      />
      {soundManager.showMiniplayer ? <MiniPlayer
        setRefreshList={setRefresh}
        refreshList={refresh}
        onPress={
          () => {
            navigation.navigate('PlayScreen', { item: soundManager.channel, schedule: soundManager.schedule })
          }
        } /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#f5eee7'
  },

  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },

  button: {
    marginLeft: 6
  },

  flatlist: {
    backgroundColor: '#f5eee7'
  }


});