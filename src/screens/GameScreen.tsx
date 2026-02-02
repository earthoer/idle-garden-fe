import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { gameApi } from '../api/game';
import { authApi } from '../api/auth';
import { User, Seed, PlantedTree } from '../types';
import { formatGold, formatTime, getRemainingTime } from '../utils/game';

interface GameScreenProps {
  onLogout: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    loadGameData();
    
    // Update timer every second
    const interval = setInterval(() => {
      setPlantedTrees(prev => [...prev]); // Force re-render
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadGameData = async () => {
    try {
      const [userData, seedsData] = await Promise.all([
        gameApi.getUser(),
        gameApi.getSeeds(),
      ]);

      setUser(userData);
      setSeeds(seedsData);
      
      // Mock planted trees (replace with actual API call)
      setPlantedTrees([]);
    } catch (error) {
      console.error('Failed to load game data:', error);
      Alert.alert('Error', 'Failed to load game data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGameData();
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authApi.logout();
          onLogout();
        },
      },
    ]);
  };

  const handlePlantTree = async (seedId: string, slotIndex: number) => {
    try {
      const plantedTree = await gameApi.plantTree(seedId, slotIndex);
      setPlantedTrees(prev => [...prev, plantedTree]);
      
      // Update user gold
      const updatedUser = await gameApi.getUser();
      setUser(updatedUser);
      
      setSelectedSlot(null);
      Alert.alert('Success', 'Tree planted!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to plant tree');
    }
  };

  const handleWaterTree = async (plantedTreeId: string) => {
    try {
      const result = await gameApi.clickTree(plantedTreeId, 1, 1);
      
      // Update planted tree
      setPlantedTrees(prev =>
        prev.map(tree =>
          tree._id === plantedTreeId ? result.plantedTree : tree
        )
      );
      
      // Update user
      setUser(result.user);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to water tree');
    }
  };

  const handleSellTree = async (plantedTreeId: string) => {
    Alert.alert('Sell Tree', 'Sell this tree?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sell',
        onPress: async () => {
          try {
            const result = await gameApi.sellTree(plantedTreeId);
            
            // Remove tree
            setPlantedTrees(prev => prev.filter(tree => tree._id !== plantedTreeId));
            
            // Update user gold
            const updatedUser = await gameApi.getUser();
            setUser(updatedUser);
            
            Alert.alert(
              'Sold!',
              `Sold ${result.seedName} (${result.quality}) for ${result.soldPrice}g!`
            );
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.goldText}>💰 {formatGold(user?.gold || 0)}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Slots */}
        <View style={styles.slotsContainer}>
          {[0, 1, 2, 3, 4].map(slot => {
            const tree = plantedTrees.find(t => t.slotIndex === slot);
            
            return (
              <View key={slot} style={styles.slot}>
                {tree ? (
                  <TreeSlot
                    tree={tree}
                    onWater={() => handleWaterTree(tree._id)}
                    onSell={() => handleSellTree(tree._id)}
                  />
                ) : (
                  <EmptySlot
                    slotIndex={slot}
                    onPress={() => setSelectedSlot(slot)}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Seed Selection Modal */}
        {selectedSlot !== null && (
          <View style={styles.seedSelection}>
            <Text style={styles.seedSelectionTitle}>Select Seed</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {seeds.map(seed => (
                <TouchableOpacity
                  key={seed._id}
                  style={styles.seedCard}
                  onPress={() => handlePlantTree(seed._id, selectedSlot)}
                >
                  <Text style={styles.seedIcon}>🌱</Text>
                  <Text style={styles.seedName}>{seed.name}</Text>
                  <Text style={styles.seedPrice}>{seed.basePrice}g</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setSelectedSlot(null)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// TreeSlot Component
interface TreeSlotProps {
  tree: PlantedTree;
  onWater: () => void;
  onSell: () => void;
}

const TreeSlot: React.FC<TreeSlotProps> = ({ tree, onWater, onSell }) => {
  const remaining = getRemainingTime(tree.plantedAt, tree.harvestableAt);
  const isReady = remaining === 0;

  return (
    <View style={styles.treeSlot}>
      <Text style={styles.treeIcon}>🌳</Text>
      <Text style={styles.treeTime}>{formatTime(remaining)}</Text>
      {isReady ? (
        <TouchableOpacity style={styles.sellButton} onPress={onSell}>
          <Text style={styles.sellButtonText}>Sell</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.waterButton} onPress={onWater}>
          <Text style={styles.waterButtonText}>💧 Water</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// EmptySlot Component
interface EmptySlotProps {
  slotIndex: number;
  onPress: () => void;
}

const EmptySlot: React.FC<EmptySlotProps> = ({ slotIndex, onPress }) => {
  return (
    <TouchableOpacity style={styles.emptySlot} onPress={onPress}>
      <Text style={styles.emptySlotText}>+</Text>
      <Text style={styles.emptySlotLabel}>Slot {slotIndex + 1}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#2a2a2a',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  goldText: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  treeSlot: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  treeTime: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 10,
  },
  waterButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  waterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sellButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptySlot: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotText: {
    fontSize: 40,
    color: '#666',
  },
  emptySlotLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  seedSelection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  seedSelectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  seedCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  seedIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  seedName: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  seedPrice: {
    fontSize: 12,
    color: '#FFD700',
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#444',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
