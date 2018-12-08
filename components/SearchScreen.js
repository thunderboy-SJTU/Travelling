import React, {Component} from 'react';
import {StyleSheet, View,YellowBox, TouchableOpacity, Text, Image} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {post,get} from '../func/functions'

// To ignore the deprecated listView, which is used in Autocomplete module
YellowBox.ignoreWarnings(['ListView is deprecated']);



// show the search screen
export class SearchScreen extends Component{


    /*
     * constructor
     * position: the location which the user searched
     * flag: magic flag, for choosing item in autoComplete form
     * query: real-time query
     */
    constructor(props) {
        super(props);
        this.state = {position:null, flag:0};
        this.query = '';
    };


    // navigation header
    static navigationOptions = (({navigation}) => ({
        title: 'Search',
    }));

    //callback for searching possible tips
    callback_tips = (json) => {
        this.setState({position:json, flag:0})
    };

    //callback for searching poi
    callback_searchPoi = (json) => {
        this.props.navigation.navigate('Home', {poi_info:json.pois[0]})
    };

    // when the query is changed, update the query and fetch the possible tips
    updateQuery = (text, position) => {

        const url = 'http://192.168.1.10:8080/travelling/route/getInputTips';
        //const url = 'https://restapi.amap.com/v3/assistant/inputtips';

        let data = {};

        if (position == null) {
            //data = {key:'2d6a3262fa75b60714083cee7969f22d', keywords: text}
            data = {keywords: text}
        }
        else {
            //data = {key:'2d6a3262fa75b60714083cee7969f22d', keywords: text, location: position.latitude + "," + position.longitude, city: position.adCode}
            data = {keywords: text, location: position.latitude + "," + position.longitude, city: position.adCode}
        }

        this.query = text;
        //get(url, data, this.callback_tips)
        post(url, data, this.callback_tips)
    };


    // search the specified poi
    searchPoi = (poi_id) => {
        const url = 'http://192.168.1.10:8080/travelling/route/getPlaceDetail';
        //const url = 'https://restapi.amap.com/v3/place/detail';

        let data = {id:poi_id};

        //get(url, data, this.callback_searchPoi)
        post(url, data, this.callback_searchPoi)

    };



    //reprocess the search items
    getSearchItem(){
        if(this.state.position == null)
            return [];
        let count = this.state.position.count;
        let tips = this.state.position.tips;
        let items = [];
        for(let i = 0; i <count; i++){
            items[i] = {key:i,name:tips[i].name,poi_id:tips[i].id}
        }
        return items
    }




    render() {
        const {navigation} = this.props;
        const position = navigation.getParam('position', null);
        let items = this.getSearchItem();
        let query = this.query;

        let queryPosition = (name, poi_id) =>{
            this.query = name;
            this.setState({flag:1});
            this.searchPoi(poi_id)
        };

        return (
            <View style={styles.container}>
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autoCompleteContainer}
                    defaultValue={query}
                    onChangeText={(text) =>{this.updateQuery(text,position)} }
                    placeholder=" 搜索地点..."
                    data={this.state.flag === 1 ? []:items}
                    renderItem={({ key, name, poi_id }) => (
                        <TouchableOpacity onPress={()=>queryPosition(name,poi_id)}>
                            {key%2 === 0? <Text style={styles.itemGray}>{name}</Text> : <Text style={styles.itemWhite}>{name}</Text>}
                        </TouchableOpacity>
                    )}
                />
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={[styles.image]} source={require('../img/search_background.jpg')}/>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15
    },
    autoCompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        marginLeft:20,
        marginRight:20,
        zIndex: 1
    },
    itemGray: {
        fontSize: 18,
        margin: 2,
        backgroundColor:'#ebedee'
    },
    itemWhite: {
        fontSize: 18,
        margin: 2,
        backgroundColor:'#fff'
    },
    image: {
        width:100,
        height:100,
        opacity:0.5
    }

});