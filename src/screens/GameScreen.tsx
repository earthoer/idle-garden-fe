import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { gameApi } from '../api/game';
import { authApi } from '../api/auth';
import { User, Seed, Location, PlantedTree } from '../types';
import { formatGold, formatTime, getRemainingTime } from '../utils/game';
import { getImageUrl, getTreeImageByProgress } from '../utils/images';

interface GameScreenProps {
  onLogout: () => void;
}

type TabType = 'seeds' | 'locations' | 'shop' | 'profile';

export const GameScreen: React.FC<GameScreenProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('seeds');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showTabContent, setShowTabContent] = useState(false); // ⭐ เพิ่ม state สำหรับ collapse
  
  // Water animation & combo states
  const [waterDrops, setWaterDrops] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [clicks, setClicks] = useState(0);
  const [totalTimeReduction, setTotalTimeReduction] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadGameData();
    
    const interval = setInterval(() => {
      setPlantedTrees(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        console.log('🧹 Cleanup: clearing debounce timer');
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  const loadGameData = async () => {
    try {
      // Load complete game state (includes user + plantedTrees)
      const gameState = await authApi.getGameState();
      
      // Load seeds and locations
      const [seedsData, locationsData] = await Promise.all([
        gameApi.getSeeds(),
        gameApi.getLocations(),
      ]);

      // Set all state
      setUser(gameState.user);
      setSeeds(seedsData);
      setLocations(locationsData);
      setPlantedTrees(gameState.plantedTrees || []); // ⭐ Load planted trees
      
      const userLocation = locationsData.find(
        (loc) => loc.code === gameState.user.currentLocation
      );
      setCurrentLocation(userLocation || locationsData[0]);
    } catch (error) {
      console.error('Failed to load game data:', error);
      Alert.alert('Error', 'Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlantTree = async (seedId: string) => {
    try {
      const result = await gameApi.plantTree(seedId, 0);
      setPlantedTrees([result.plantedTree]);
      
      const updatedUser = await authApi.getMe();
      setUser(updatedUser);
      
      Alert.alert('Success', '🌱 Tree planted!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to plant tree');
    }
  };

  // คำนวณ time reduction จาก clicks
  const calculateTimeReduction = (clickCount: number): number => {
    let total = 0;
    for (let i = 0; i < clickCount; i++) {
      if (i >= 30) {
        total += 3; // ×3 at 30+ clicks
      } else if (i >= 10) {
        total += 2; // ×2 at 10-29 clicks
      } else {
        total += 1; // ×1 at 0-9 clicks
      }
    }
    return total;
  };

  // ยิง API
  const sendWaterAPI = async (clickCount: number, timeReduction: number) => {
    if (plantedTrees.length === 0 || clickCount === 0) return;
    
    console.log('📡 Sending API...', { clickCount, timeReduction, treeId: plantedTrees[0]._id });
    
    try {
      const result = await gameApi.clickTree(
        plantedTrees[0]._id,
        clickCount,
        timeReduction
      );
      
      console.log('✅ API Success!', result);
      
      // Update tree
      const updatedTrees = plantedTrees.map((tree) =>
        tree._id === plantedTrees[0]._id
          ? { ...tree, timeReduced: (tree.timeReduced || 0) + timeReduction }
          : tree
      );
      setPlantedTrees(updatedTrees);
      
      // Reset combo
      setClicks(0);
      setTotalTimeReduction(0);
      
      console.log('🔄 Combo reset');
    } catch (error: any) {
      console.error('❌ API Failed:', error);
    }
  };

  const handleWaterTree = () => {
    if (plantedTrees.length === 0) return;
    const currentTree = plantedTrees[0];
    
    // คำนวณเวลาเหลือ
    const now = Date.now();
    const endTimeValue = (currentTree.endTime || currentTree.harvestableAt) as Date;
    const endTime = new Date(endTimeValue).getTime();
    const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
    
    // ถ้าโตแล้ว ไม่ให้รด
    if (timeLeft === 0) return;
    
    console.log('🌊 Water clicked!', clicks + 1); // Debug
    
    // เพิ่ม water drop animation (ตรงกลางจอ)
    const dropId = Date.now();
    const randomX = 150 + Math.random() * 100; // Random around center
    const randomY = 100 + Math.random() * 100;
    setWaterDrops(prev => [...prev, { id: dropId, x: randomX, y: randomY }]);
    
    // ลบ animation หลัง 1 วิ
    setTimeout(() => {
      setWaterDrops(prev => prev.filter(drop => drop.id !== dropId));
    }, 1000);
    
    // เพิ่ม clicks
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    console.log('🔥 Combo:', newClicks); // Debug
    
    // คำนวณเวลาที่ลด
    const newTimeReduction = calculateTimeReduction(newClicks);
    setTotalTimeReduction(newTimeReduction);
    
    console.log('⏱️ Setting timer...', { newClicks, newTimeReduction });
    
    // Clear timer เดิม
    if (debounceTimer) {
      console.log('🗑️ Clearing old timer');
      clearTimeout(debounceTimer);
    }
    
    // ตั้ง timer ใหม่ 5 วิ
    const timer = setTimeout(() => {
      console.log('⏰ Timer fired! Sending API...');
      sendWaterAPI(newClicks, newTimeReduction);
    }, 5000);
    
    setDebounceTimer(timer);
    console.log('✅ Timer set! Will fire in 5s');
    
    // เช็คว่าถ้าลดเวลาครบแล้ว ยิงเลย
    const startTimeValue = (currentTree.startTime || currentTree.plantedAt) as Date;
    const totalTime = endTime - new Date(startTimeValue).getTime();
    const alreadyReduced = currentTree.timeReduced || 0;
    const willBeReduced = alreadyReduced + newTimeReduction;
    
    if (willBeReduced * 1000 >= totalTime) {
      // ต้นจะโตแล้ว ยิงเลย
      if (debounceTimer) clearTimeout(debounceTimer);
      sendWaterAPI(newClicks, newTimeReduction);
    }
  };

  const handleSellTree = async () => {
    if (plantedTrees.length === 0) return;
    
    console.log('🌳 Sell clicked!'); // Debug
    
    Alert.alert('Sell Tree', 'Sell this tree?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sell',
        onPress: async () => {
          try {
            const result = await gameApi.sellTree(plantedTrees[0]._id);
            setPlantedTrees([]);
            
            const updatedUser = await authApi.getMe();
            setUser(updatedUser);
            
            Alert.alert('💰 Sold!', `${result.seedName} for ${result.soldPrice}g!`);
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to sell tree');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const currentTree = plantedTrees[0];
  
  // Calculate progress and remaining time
  let remaining = 0;
  let progressPercent = 0;
  let isReady = false;
  let currentSeed: Seed | undefined;
  
  if (currentTree) {
    // Get seed info
    currentSeed = seeds.find(s => s._id === currentTree.seedId || s._id === (currentTree.seedId as any)?._id);
    
    // Calculate remaining time
    const now = Date.now();
    const startTimeValue = (currentTree.startTime || currentTree.plantedAt) as Date;
    const startTime = new Date(startTimeValue).getTime();
    const endTimeValue = (currentTree.endTime || currentTree.harvestableAt) as Date;
    const endTime = new Date(endTimeValue).getTime();
    
    // หัก timeReduced (วินาที → milliseconds)
    const timeReducedMs = (currentTree.timeReduced || 0) * 1000;
    const adjustedEndTime = endTime - timeReducedMs;
    
    const totalTime = adjustedEndTime - startTime;
    const elapsed = now - startTime;
    
    remaining = Math.max(0, Math.floor((adjustedEndTime - now) / 1000));
    progressPercent = totalTime > 0 ? Math.min(100, (elapsed / totalTime) * 100) : 0;
    isReady = remaining === 0;
    
    // Debug
    console.log('⏱️ Timer:', {
      remaining,
      timeReduced: currentTree.timeReduced,
      isReady,
      endTime: new Date(endTime).toISOString(),
      adjustedEndTime: new Date(adjustedEndTime).toISOString()
    });
  } // ← ปิด if block

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🌱</Text>
          <View>
            <Text style={styles.logoTitle}>Idle</Text>
            <Text style={styles.logoTitle}>Garden</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.goldBadge}>
            <Text style={styles.goldIcon}>💰</Text>
            <Text style={styles.goldText}>{formatGold(user?.gold || 0)}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onLogout}>
            <Text style={styles.icon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Picker */}
      {showLocationPicker && (
        <View style={styles.locationPicker}>
          {locations.map((location) => (
            <TouchableOpacity
              key={location._id}
              style={[
                styles.locationItem,
                location._id === currentLocation?._id && styles.locationItemActive
              ]}
              onPress={() => {
                setCurrentLocation(location);
                setShowLocationPicker(false);
              }}
            >
              <Text style={styles.locationItemIcon}>{location.icon}</Text>
              <Text style={styles.locationItemName}>{location.name}</Text>
              {location.price > 0 && (
                <Text style={styles.locationItemPrice}>{location.price}g</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* Main Game Area with Background */}
        <ImageBackground
          source={{ uri: currentLocation ? getImageUrl(currentLocation.locationImageUrl) : undefined }}
          style={styles.gameAreaBackground}
          resizeMode="cover"
        >
          <TouchableOpacity 
            style={styles.gameArea}
            activeOpacity={0.9}
            onPress={() => {
              console.log('🎮 Click detected!', { currentTree: !!currentTree, isReady });
              if (!currentTree) return;
              if (isReady) {
                handleSellTree();
              } else {
                handleWaterTree();
              }
            }}
            disabled={!currentTree}
          >
            {/* Tree Visual */}
            <View style={styles.treeVisual}>
              {currentTree && currentSeed ? (
                <>
                  {/* Seed Plant Image - Growth Stage */}
                  <Image
                    source={{ uri: getTreeImageByProgress(currentSeed.icon, progressPercent) }}
                    style={styles.treePlantImage}
                    resizeMode="contain"
                  />
                  {/* Location Pot Image */}
                  <Image
                    source={{ uri: currentLocation ? getImageUrl(currentLocation.potImageUrl) : undefined }}
                    style={styles.treePotImage}
                    resizeMode="contain"
                  />
                </>
              ) : (
                <>
                  {/* Empty Pot */}
                  <Image
                    source={{ uri: currentLocation ? getImageUrl(currentLocation.potImageUrl) : undefined }}
                    style={styles.emptyPotImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </View>

          {/* Water Drops Animation */}
          {waterDrops.map((drop) => (
            <View
              key={drop.id}
              style={[
                styles.waterDrop,
                { left: drop.x, top: drop.y }
              ]}
            >
              <Text style={styles.waterDropText}>💧</Text>
            </View>
          ))}
          
          {/* Combo Indicator */}
          {clicks > 0 && (
            <View style={styles.comboIndicator}>
              <Text style={styles.comboText}>
                {clicks} clicks 🔥
              </Text>
              <Text style={styles.comboMultiplier}>
                {clicks >= 30 ? '×3' : clicks >= 10 ? '×2' : '×1'}
              </Text>
              <Text style={styles.comboTimeReduction}>
                -{totalTimeReduction}s
              </Text>
            </View>
          )}

          {/* Tree Info Card */}
          {currentTree && currentSeed && (
            <View style={styles.treeCard}>
              <Text style={styles.treeCardTitle}>
                {currentSeed.name} - ⭐ {currentTree.quality}
              </Text>
              
              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(100, progressPercent)}%` }
                  ]} 
                />
              </View>

              {/* Stats */}
              <View style={styles.treeStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>⏱️ Time Left</Text>
                  <Text style={styles.statValue}>{formatTime(remaining)}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>🔥 Combo</Text>
                  <Text style={styles.statValue}>{clicks > 0 ? `${clicks}x` : '0x'}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>💰 Sell Value</Text>
                  <Text style={styles.statValue}>{currentSeed.baseSellPrice}g</Text>
                </View>
              </View>
            </View>
          )}

          </TouchableOpacity>
        </ImageBackground>

        {/* Bottom Tabs */}
        <View style={styles.bottomTabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'seeds' && styles.tabActive]}
            onPress={() => {
              if (activeTab === 'seeds') {
                setShowTabContent(!showTabContent); // Toggle
              } else {
                setActiveTab('seeds');
                setShowTabContent(true); // เปิด
              }
            }}
          >
            <Text style={styles.tabIcon}>🌱</Text>
            <Text style={styles.tabLabel}>Seeds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'locations' && styles.tabActive]}
            onPress={() => {
              if (activeTab === 'locations') {
                setShowTabContent(!showTabContent);
              } else {
                setActiveTab('locations');
                setShowTabContent(true);
              }
            }}
          >
            <Text style={styles.tabIcon}>🗺️</Text>
            <Text style={styles.tabLabel}>Locations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'shop' && styles.tabActive]}
            onPress={() => {
              if (activeTab === 'shop') {
                setShowTabContent(!showTabContent);
              } else {
                setActiveTab('shop');
                setShowTabContent(true);
              }
            }}
          >
            <Text style={styles.tabIcon}>🛒</Text>
            <Text style={styles.tabLabel}>Shop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
            onPress={() => {
              if (activeTab === 'profile') {
                setShowTabContent(!showTabContent);
              } else {
                setActiveTab('profile');
                setShowTabContent(true);
              }
            }}
          >
            <Text style={styles.tabIcon}>👤</Text>
            <Text style={styles.tabLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content - แสดงเฉพาะเมื่อเปิด */}
        {showTabContent && (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'seeds' && (
            <View style={styles.seedsGrid}>
              {seeds.map((seed) => {
                const canAfford = (user?.gold || 0) >= seed.basePrice;
                
                return (
                  <TouchableOpacity
                    key={seed._id}
                    style={[styles.seedCard, !canAfford && styles.seedCardDisabled]}
                    onPress={() => canAfford && !currentTree && handlePlantTree(seed._id)}
                    disabled={!canAfford || !!currentTree}
                  >
                    <Image
                      source={{ uri: getImageUrl(seed.icon) }}
                      style={styles.seedCardImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.seedCardName}>{seed.name}</Text>
                    <Text style={styles.seedCardPrice}>
                      {seed.basePrice === 0 ? 'FREE' : `${seed.basePrice}g`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'locations' && (
            <View style={styles.locationsGrid}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location._id}
                  style={[
                    styles.locationCard,
                    location._id === currentLocation?._id && styles.locationCardActive
                  ]}
                  onPress={() => setCurrentLocation(location)}
                >
                  <Text style={styles.locationCardIcon}>{location.icon}</Text>
                  <Text style={styles.locationCardName}>{location.name}</Text>
                  <Text style={styles.locationCardBonus}>
                    {location.bonusType === 'grow_speed' && `⚡ ${location.bonusValue}%`}
                    {location.bonusType === 'sell_price' && `💰 +${location.bonusValue}%`}
                  </Text>
                  {location.price > 0 && (
                    <Text style={styles.locationCardPrice}>{location.price}g</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'shop' && (
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>🛒 Shop Coming Soon!</Text>
            </View>
          )}

          {activeTab === 'profile' && (
            <View style={styles.profileContent}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{user?.totalTreesSold || 0}</Text>
                  <Text style={styles.profileStatLabel}>Trees Sold</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{formatGold(user?.totalEarnings || 0)}</Text>
                  <Text style={styles.profileStatLabel}>Total Earnings</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        )} 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d5f4f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d5f4f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(45, 95, 79, 0.95)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 18,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  goldIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  goldText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  locationPicker: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  locationItemActive: {
    backgroundColor: '#4CAF50',
  },
  locationItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  locationItemName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationItemPrice: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  gameAreaBackground: {
    width: '100%',
  },
  gameArea: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(45, 95, 79, 0.3)',
    minHeight: 500, // ⭐ ทำให้คลิกได้ทั้งพื้นที่
    justifyContent: 'center',
  },
  treeVisual: {
    alignItems: 'center',
    marginBottom: 20,
    height: 200,
    justifyContent: 'flex-end',
  },
  treePlantImage: {
    width: 120,
    height: 120,
    marginBottom: -30,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  treePotImage: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
  emptyPotImage: {
    width: 100,
    height: 100,
  },
  treePlant: {
    fontSize: 80,
    marginBottom: -20,
  },
  treePot: {
    fontSize: 60,
  },
  emptyPot: {
    fontSize: 80,
  },
  treeCard: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  treeCardTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  treeStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#2d5f4f',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    paddingBottom: 20, // Safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    color: '#fff',
    fontSize: 12,
  },
  tabContent: {
    padding: 16,
    position: 'absolute',
    bottom: 85, // เหนือ bottomTabs (12 + 20 + เผื่อ)
    left: 0,
    right: 0,
    backgroundColor: 'rgba(45, 95, 79, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%', // จำกัดความสูง
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  seedsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seedCard: {
    width: '31%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  seedCardDisabled: {
    opacity: 0.5,
  },
  seedCardImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  seedCardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  seedCardName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  seedCardPrice: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationsGrid: {
    gap: 12,
  },
  locationCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationCardActive: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#66BB6A',
  },
  locationCardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  locationCardName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationCardBonus: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 12,
  },
  locationCardPrice: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  comingSoon: {
    padding: 40,
    alignItems: 'center',
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 18,
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileEmail: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 24,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 40,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileStatLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  waterDrop: {
    position: 'absolute',
    zIndex: 999,
    opacity: 0.8,
  },
  waterDropText: {
    fontSize: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  comboIndicator: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 998,
    minWidth: 150,
  },
  comboText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comboMultiplier: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  comboTimeReduction: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
