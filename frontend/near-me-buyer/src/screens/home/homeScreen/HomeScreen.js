import React, { useCallback, useState, useEffect } from 'react'
import { View, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { SliderBox } from "react-native-image-slider-box";

//components
import { categoriesMenu } from '../../../menus';
import CategoryCard from '../../../components/cards/CategoryCard';
import ProductCard from '../../../components/cards/ProductCard';
import SubHeading from '../../../components/title/SubHeading';
import LoadingScreen from '../../../components/LoadingScreen';
import WalletSyncModal from '../../../components/WalletSyncModal';
import { productServices } from '../../../services';
import { adServices } from '../../../services';
import { walletActions } from '../../../redux/actions';



const HomeScreen = ({ navigation }) => {

    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [medicineProducts, setMedicineProducts] = useState([]);
    const [sportsProducts, setSportsProducts] = useState([]);
    const [electronicsProducts, setElectronicsProducts] = useState([]);
    const [groceriesProducts, setGroceriesProducts] = useState([]);
    const [cat1Loading, setCat1Loading] = useState(false);
    const [cat2Loading, setCat2Loading] = useState(false);
    const [cat3Loading, setCat3Loading] = useState(false);
    const [cat4Loading, setCat4Loading] = useState(false);
    const [adLoading, setAdLoading] = useState(false);
    const [ad, setAd] = useState(false);
    const cartLoading = useSelector(state => state.cart.loading);
    const wishlistLoading = useSelector(state => state.wishlist.loading);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const visible = true;

    useEffect(() => {
        dispatch(walletActions.getWalletDetails(user));
    }, []);
    
    //handles refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.selectionAsync()

        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setRefreshing(false);
        }, 2000)

    }, []);

    useEffect(() => {
        setCat4Loading(true);
      productServices.allProductsFromCategory("Groceries")
      .then(
          products => {
            setGroceriesProducts(products);
            setCat4Loading(false);
          }
      ),
      error => {
        console.log(error);
        setCat4Loading(false);
    }
    }, []);

    useEffect(() => {
        setCat1Loading(true);
      productServices.allProductsFromCategory("Medicine")
      .then(
          products => {
            setMedicineProducts(products);
            setCat1Loading(false);
          }
      ),
      error => {
        console.log(error);
        setCat1Loading(false);
    }
    }, []);

    useEffect(() => {
        setCat2Loading(true);
        productServices.allProductsFromCategory("Sports")
        .then(
            products => {
                setSportsProducts(products);
                setCat2Loading(false);
            }
        ),
        error => {
            console.log(error);
            setCat2Loading(false);
        }
      }, []);

      
      useEffect(() => {
        setCat3Loading(true);
        productServices.allProductsFromCategory("Electronics")
        .then(
            products => {
                setElectronicsProducts(products);
                setCat3Loading(false);
            }
        ),
        error => {
            console.log(error);
            setCat3Loading(false);
        }
      }, []);

      useEffect(() => {
       setAdLoading(true);
       adServices.getAds()
        .then(
            ads => {
                setAd(ads);
                setAdLoading(false);
            }
        ),
        error => {
            console.log(error);
            setAdLoading(false);
        }
      }, []);


      if(cat1Loading || cat2Loading || cat3Loading || cat4Loading || adLoading || cartLoading || wishlistLoading){
          return <LoadingScreen />
      }

      if(ad){
        var adsArray = ad.map(ad => ad.image);
        var adsId = ad.map(ad => ad.product_id);
        var adsSellerIds = ad.map(ad => ad.seller_id);
      }
    
    return (
        <ScrollView
            style={{ backgroundColor: "#E5E5E5" }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['white']}
                    enabled
                    progressBackgroundColor="black"
                    tintColor="black"
                />}
        >
          <WalletSyncModal modalVisible={modalVisible}  />
            <View style={{ marginTop: 25 }}>
                <FlatList
                    horizontal
                    contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    data={categoriesMenu}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate("categoryScreen", { name: item.name })}>
                            <CategoryCard
                                name={item.name}
                                icon={item.icon}
                            />
                        </TouchableOpacity>
                    )}
                />
                <View style={{ marginTop: 20 }}>
                    <SliderBox
                        images={ad && adsArray}
                        onCurrentImagePressed={index => navigation.navigate("productScreen", { productId: adsId[index] , sellerId: adsSellerIds[index]})}
                        autoplay={true}
                        dotColor="white"
                        circleLoop={true}
                        imageLoadingColor="#ADADAD"
                        ImageComponentStyle={{ borderRadius: 8, width: '97%'}}
                    />
                </View>
                <SubHeading name="Groceries" />
                <FlatList
                    horizontal
                    contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    data={groceriesProducts}
                    keyExtractor={item => item.product_id}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: 10, height: 290 }}>
                            <ProductCard
                                name={item.product_name}
                                shop={item.seller_name}
                                price={item.price}
                                image={item.product_image}
                                productId={item.product_id}
                                sellerId={item.seller_id}
                                navigation={navigation}
                            />
                        </View>
                    )}
                />
                <SubHeading name="Sports" />
                <FlatList
                    horizontal
                    contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    data={sportsProducts}
                    keyExtractor={item => item.product_id}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: 10, height: 290 }}>
                            <ProductCard
                                name={item.product_name}
                                shop={item.seller_name}
                                price={item.price}
                                image={item.product_image}
                                productId={item.product_id}
                                sellerId={item.seller_id}
                                navigation={navigation}
                            />
                        </View>
                    )}
                />
                <SubHeading name="Medicine" />
                <FlatList
                    horizontal
                    contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    data={medicineProducts}
                    keyExtractor={item => item.product_id}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: 10, height: 290 }}>
                            <ProductCard
                                name={item.product_name}
                                shop={item.seller_name}
                                price={item.price}
                                image={item.product_image}
                                productId={item.product_id}
                                sellerId={item.seller_id}
                                navigation={navigation}
                            />
                        </View>
                    )}
                />
                   <SubHeading name="Electronics" />
                <FlatList
                    horizontal
                    contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    data={electronicsProducts}
                    keyExtractor={item => item.product_id}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: 10, height: 290 }}>
                            <ProductCard
                                name={item.product_name}
                                shop={item.seller_name}
                                price={item.price}
                                image={item.product_image}
                                productId={item.product_id}
                                sellerId={item.seller_id}
                                navigation={navigation}
                            />
                        </View>
                    )}
                />
            </View>
        </ScrollView >
    )
}

export default HomeScreen
