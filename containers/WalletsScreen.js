import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { connect } from "react-redux";

import Custom_Text from "../components/shared/Custom_Text";
import Custom_Header from "../components/shared/Custom_Header";
import Custom_HeaderTitle from "../components/shared/Custom_HeaderTitle";
import Custom_HeaderButton from "../components/shared/Custom_HeaderButton";
import Custom_IconButton from "../components/shared/Custom_IconButton";
import Fonts from "../constants/Fonts";
import Colors from "../constants/Colors";
import WalletCard from "./WalletCard";
import {
  getMarketData,
  getMarketSevens,
  getBalance,
  getSoloData,
} from "../actions";
import { screenWidth } from "../constants/Layout";
import images from "../constants/Images";

function WalletsScreen({
  navigation,
  getMarketData,
  getSoloData,
  getMarketSevens,
  getBalance,
  marketData,
  soloData,
  wallets,
  baseCurrency,
  screenProps: { rootNavigation },
}) {
  useEffect(() => {
    fetchData();
    const getMarketDataInterval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => {
      clearInterval(getMarketDataInterval);
    };
  }, [baseCurrency, wallets]);

  const fetchData = () => {
    getMarketData(baseCurrency.value);
    getSoloData();
    getMarketSevens();
  };

  return (
    <View style={styles.container}>
      <Custom_Header
        // left={
        //   <View style={{ marginLeft: 20 }}>
        //     <Image source={images.solo} style={{ height: 24, width: 24 }} />
        //   </View>
        // }
        center={<Custom_HeaderTitle text="Your Wallets" />}
        right={
          <Custom_HeaderButton
            onPress={() => {
              if (navigation) {
                navigation.navigate({
                  routeName: "SettingsScreen",
                  key: "SettingsScreen",
                });
              } else {
                rootNavigation.navigate({
                  routeName: "SettingsScreen",
                  key: "SettingsScreen",
                });
              }
            }}
            type="icon"
            icon="md-settings"
            iconColor={Colors.text}
          />
        }
      />
      <ScrollView>
        {!marketData || !soloData ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <ActivityIndicator size="small" color={Colors.darkRed} />
          </View>
        ) : wallets.length > 0 ? (
          <View style={styles.section}>
            {wallets.map((item, index) => {
              // console.log("hey", item.id, item.walletAddress)
              // getBalance(item.id, item.rippleClassicAddress);
              return (
                <View key={index} style={{ marginBottom: 20 }}>
                  <WalletCard
                    navigation={navigation ? navigation : rootNavigation}
                    // defaultCurrency="usd"
                    baseCurrency={baseCurrency}
                    wallet={item}
                    key={index}
                    marketData={marketData}
                    soloData={soloData}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={[
              styles.section,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Custom_Text
              value="No Wallets Added"
              size={Fonts.size.large}
              color={Colors.text}
            />
          </View>
        )}
        <View style={{ height: 100, width: screenWidth }} />
      </ScrollView>
      {/* <View style={styles.footer}>
        <Image source={images.gradient} style={styles.gradient} />
      </View> */}
      <Custom_IconButton
        icon="md-add"
        color={Colors.text}
        onPress={() => {
          if (navigation) {
            navigation.navigate({
              routeName: "AddWalletScreen",
              key: "AddWalletScreen",
            });
          } else {
            rootNavigation.navigate({
              routeName: "AddWalletScreen",
              key: "AddWalletScreen",
            });
          }
        }}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 3,
          paddingTop: 2,
          position: "absolute",
          right: 20,
          bottom: 30,
          zIndex: 3,
        }}
      />
    </View>
    // </View>
  );
}

WalletsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    zIndex: 2,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  footer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
  },
  gradient: {
    height: 100,
    width: screenWidth,
    zIndex: 1,
  },
});

const mapStateToProps = ({ marketData, wallets, baseCurrency, soloData }) => ({
  marketData,
  wallets,
  baseCurrency,
  soloData,
});

const mapDispatchToProps = dispatch => ({
  getMarketData: baseCurrency => dispatch(getMarketData(baseCurrency)),
  getSoloData: () => dispatch(getSoloData()),
  getMarketSevens: () => dispatch(getMarketSevens()),
  getBalance: (id, address) => dispatch(getBalance(id, address)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WalletsScreen);
