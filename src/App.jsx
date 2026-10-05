import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import PlantsView from './views/PlantsView';
import PlantModal from './components/PlantModal';
import Footer from './components/Footer';
import { mockGeneralWeather, mockPlants } from './data/mockData';
import { fetchDashboardData } from './services/weatherService';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [weatherData, setWeatherData] = useState(mockGeneralWeather);
  const [plantsData, setPlantsData] = useState(mockPlants);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    const result = await fetchDashboardData();
    setWeatherData(result.weather);
    setPlantsData(result.plants);
    setIsLiveApi(result.isLive);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
  };

  const handleCloseModal = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light-subtle">
      {/* Navbar Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isLiveApi={isLiveApi}
      />

      {/* Conteúdo Principal */}
      <main className="container py-4 flex-grow-1">
        {activeTab === 'home' && (
          <HomeView
            weather={weatherData}
            plants={plantsData}
            onSelectPlant={handleSelectPlant}
            onNavigateToPlants={() => setActiveTab('plants')}
          />
        )}

        {activeTab === 'plants' && (
          <PlantsView
            plants={plantsData}
            onSelectPlant={handleSelectPlant}
          />
        )}
      </main>

      {/* Modal com Diretrizes Agronômicas da Cultura */}
      <PlantModal
        plant={selectedPlant}
        onClose={handleCloseModal}
      />

      {/* Rodapé Informativo */}
      <Footer />
    </div>
  );
}
