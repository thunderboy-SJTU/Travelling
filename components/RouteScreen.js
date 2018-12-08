import React, {Component} from 'react';
import {StyleSheet, View, YellowBox, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {post,get} from '../func/functions'
import {SearchBar,SegmentedControl} from 'antd-mobile-rn'
import {AMapView} from "./AMapView";

// To ignore
YellowBox.ignoreWarnings(['Failed prop type']);

// show the search screen
export class RouteScreen extends Component {

    /*
     * constructor
     * position: the location which the user searched
     * flag: magic flag, for choosing item in autoComplete form
     * query: real-time query
     */
    constructor(props) {
        super(props);
        this.state = {position:null, begin_flag:0, end_flag:0};
        this.query = '';
    };


    // navigation header
    static navigationOptions = (({navigation}) => ({
        title: 'Route',
    }));






    render() {
        const {navigation} = this.props;
        const position = navigation.getParam('position', null);
        const start_poi = navigation.getParam('begin_poi',null);
        const end_poi = navigation.getParam('end_poi', null);

        const start_name = position?"我的位置":start_poi.name;
        const end_name = end_poi.name;

        return (
            <View style={StyleSheet.absoluteFill}>
                <View>
                    <SearchBar disabled placeholder="输入起点" value={start_name}/>
                </View>
                    <View>
                    <SearchBar
                        disabled placeholder="输入终点" value={end_name}/>
                </View>
                <SegmentedControl
                    selectedIndex={0}
                    values={['步行', '驾车', '公交', '骑行']}
                />
                <Text/>
                <AMapView/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput:{
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