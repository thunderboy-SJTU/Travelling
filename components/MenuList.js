import React, {Component} from 'react';
import {StyleSheet, SectionList, View, Text, TouchableHighlight, BackHandler, Alert,PixelRatio, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

// the component is used to render menu list
export default class MenuList extends Component {
    constructor(props) {
        super(props);
    }

    // render the header
    renderHeader(){
        return(
            <Image resizeMode='cover' style={styles.headImg}
                   source={require('../img/background.jpg')}>
            </Image>
        );
    }

    // render section
    renderSection = (info) => {
        let txt = info.section.key;
        return <Text
            style={styles.sectionStyle}>{txt}</Text>
    };

    // render each row
    renderRow = (info) => {
        let data = info.item.title;
        let icon = info.item.icon;
        let rowId = info.item.key;
        return (
            <View style={{flex:1}}>
                <TouchableHighlight underlayColor='#ddd' onPress={()=>this.onSelectItem(rowId)}>
                    <View style={styles.item} >
                        <Icon name={icon} size={23} color="black" />
                        <Text style={styles.itemStyle}>{data}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    };

    // bind item with its callback function
    onSelectItem = (item) => {
        let func = this.props.onMenuItem;
        func&&func(item);
    };

    render(){
        let sections = [
            {key:"地图信息",data:[{key:1, title:"打开/关闭路况", icon:"traffic"}]}
        ];
        return (
            <View style={{flex:1}}>
                <SectionList
                    style={{backgroundColor:'#ebedee'}}
                    renderSectionHeader={this.renderSection}
                    renderItem={this.renderRow}
                    sections={sections}
                    ItemSeparatorComponent={() => <View><Text/></View>}
                    ListHeaderComponent={this.renderHeader}
                />

                <View style={{flexDirection:'row',height:46,alignItems:'center'}}>
                    <TouchableHighlight style={{flex:1}} underlayColor='#ddd' onPress={()=>alert('设置')}>
                        <View style={styles.btn}><Text>设置</Text></View>
                    </TouchableHighlight>
                    <View style={{backgroundColor:'#d8dadb', width:1/PixelRatio.get(),height:20,}}/>
                    <TouchableHighlight style={{flex:1}} underlayColor='#ddd'
                                        onPress={()=>{
                                            Alert.alert('退出应用','确定要退出吗?',
                                                [
                                                    {text:'确定',onPress:()=>{BackHandler.exitApp()}},
                                                    {text:'取消',onPress:()=>{}}
                                                ]
                                            );
                                        }}>
                        <View style={styles.btn}><Text>退出应用</Text></View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles=StyleSheet.create({
    headImg:{
        height:140,
        width:230,
    },
    sectionStyle:{
        color: 'black',
        backgroundColor: '#f5f5f5',
        paddingLeft: 20,
        height: 24,
        lineHeight: 24,
    },
    itemStyle:{
        color:'#333333',
        marginLeft:5,
        fontSize:16
    },
    item:{
        height:50,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10,
    },
    btn:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
});