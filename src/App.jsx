import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import PlantsView from './views/PlantsView';
import PlantModal from './components/PlantModal';
import Footer from './components/Footer';
import { mockGeneralWeather, mockPlants } from './data/mockData';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [weatherData, setWeatherData] = useState(mockGeneralWeather);
  const [plantsData, setPlantsData] = useState(mockPlants);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWeatherData((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        current: {
          ...prev.current,
          temp: +(25.5 + Math.random() * 2).toFixed(1),
          humidity: Math.floor(65 + Math.random() * 8),
        }
      }));
      setPlantsData((prev) => [...prev]);
      setIsRefreshing(false);
    }, 400);
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
