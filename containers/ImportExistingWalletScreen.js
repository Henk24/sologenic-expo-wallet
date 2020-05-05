import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Custom_Text from "../components/shared/Custom_Text";
import Custom_Header from "../components/shared/Custom_Header";
import Custom_HeaderTitle from "../components/shared/Custom_HeaderTitle";
import Custom_HeaderButton from "../components/shared/Custom_HeaderButton";
import Fonts from "../constants/Fonts";
import Colors from "../constants/Colors";
import PassphraseTab from "./PassphraseTab";
import WalletAddressSecretTab from "./WalletAddressSecretTab";
import XummTab from "./XummTab";
import { screenWidth } from "../constants/Layout";

export default function ImportExistingWalletScreen({ navigation }) {
  const [tab, handleTabView] = useState(1);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [
    importSuccessfulModalVisible,
    setImportSuccessfulModalVisible,
  ] = useState(false);

  const switchTabView = tab => {
    if (tab === 1) {
      return (
        <PassphraseTab
          navigation={navigation}
          errorModalVisible={errorModalVisible}
          setErrorModalVisible={setErrorModalVisible}
          importSuccessfulModalVisible={importSuccessfulModalVisible}
          setImportSuccessfulModalVisible={setImportSuccessfulModalVisible}
        />
      );
    } else if (tab === 2) {
      console.log("hey tab === 2")
      return (
        <WalletAddressSecretTab
          navigation={navigation}
          errorModalVisible={errorModalVisible}
          setErrorModalVisible={setErrorModalVisible}
          importSuccessfulModalVisible={importSuccessfulModalVisible}
          setImportSuccessfulModalVisible={setImportSuccessfulModalVisible}
        />
      );
    } else if (tab === 3) {
      console.log("hey tab === 3")
      return (
        <XummTab
          navigation={navigation}
          errorModalVisible={errorModalVisible}
          setErrorModalVisible={setErrorModalVisible}
          importSuccessfulModalVisible={importSuccessfulModalVisible}
          setImportSuccessfulModalVisible={setImportSuccessfulModalVisible}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <Custom_Header
        left={
          <Custom_HeaderButton
            onPress={() => {
              navigation.goBack();
            }}
            type="icon"
            icon="md-arrow-back"
            iconColor={Colors.text}
          />
        }
        center={<Custom_HeaderTitle text="Import Existing Wallet" />}
        right={<View />}
      />
      <View
        style={{
          flexDirection: "row",
          height: 50,
          backgroundColor: Colors.headerBackground,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handleTabView(1);
          }}
          style={[
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
            tab === 1
              ? {
                  borderBottomColor: Colors.text,
                  borderBottomWidth: 2,
                }
              : {},
          ]}
        >
          <Custom_Text value="Recovery Words" size={Fonts.size.normal} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleTabView(2);
          }}
          style={[
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
            tab === 2
              ? {
                  borderBottomColor: Colors.text,
                  borderBottomWidth: 2,
                }
              : {},
          ]}
        >
          <Custom_Text
            value="Wallet Address + Secret"
            size={Fonts.size.normal}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleTabView(3);
          }}
          style={[
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
            tab === 3
              ? {
                  borderBottomColor: Colors.text,
                  borderBottomWidth: 2,
                }
              : {},
          ]}
        >
          <Custom_Text
            value="XUMM"
            size={Fonts.size.normal}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <KeyboardAwareScrollView>
          {/* {tab === 1 ? (
            <PassphraseTab
              navigation={navigation}
              errorModalVisible={errorModalVisible}
              setErrorModalVisible={setErrorModalVisible}
              importSuccessfulModalVisible={importSuccessfulModalVisible}
              setImportSuccessfulModalVisible={setImportSuccessfulModalVisible}
            />
          ) : (
            <WalletAddressSecretTab
              navigation={navigation}
              errorModalVisible={errorModalVisible}
              setErrorModalVisible={setErrorModalVisible}
              importSuccessfulModalVisible={importSuccessfulModalVisible}
              setImportSuccessfulModalVisible={setImportSuccessfulModalVisible}
            />
          )} */}
            {switchTabView(tab)}
          <View style={{ height: 40, width: screenWidth }} />
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
}

ImportExistingWalletScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  addWalletContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    justifyContent: "center",
    alignItems: "center",
  },
  passphraseTextInputContainer: {
    marginHorizontal: 40,
    marginTop: 30,
    marginBottom: 60,
  },
  passphraseTextInput: {
    borderBottomColor: Colors.text,
    borderBottomWidth: 1,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginHorizontal: 20,
    marginVertical: 50,
  },
});
