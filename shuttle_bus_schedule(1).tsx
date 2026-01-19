import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ArrowRight, AlertCircle, Map } from 'lucide-react';

const ShuttleBusSchedule = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLocationSelect, setShowLocationSelect] = useState(true);

  const schedules = {
    公道五: [
      '08:45', '09:45', '10:40', '11:30', '13:15', '14:30', '15:30'
    ],
    展業二路: [
      '09:15', '10:15', '11:10', '11:50', '13:45', '15:00', '16:30'
    ]
  };

  const stationInfo = {
    公道五: {
      note: 'B1上車',
      mapUrl: 'https://maps.app.goo.gl/PaFzPYjwY755mXZ96'
    },
    展業二路: {
      note: '停車場上車',
      mapUrl: 'https://maps.app.goo.gl/4c51HBb5aoApZwnB8'
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextBus = (station) => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const times = schedules[station];
    for (let timeStr of times) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const busMinutes = hours * 60 + minutes;
      if (busMinutes > currentMinutes) {
        return { time: timeStr, minutes: busMinutes - currentMinutes };
      }
    }
    return null;
  };

  const getAllNextBuses = () => {
    return {
      公道五: getNextBus('公道五'),
      展業二路: getNextBus('展業二路')
    };
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setShowLocationSelect(false);
  };

  const destination = selectedStation === '公道五' ? '展業二路' : '公道五';
  const nextBus = selectedStation ? getNextBus(selectedStation) : null;
  const allBuses = selectedStation ? schedules[selectedStation] : [];

  if (showLocationSelect) {
    const nextBuses = getAllNextBuses();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">接駁車時刻表</h1>
            <p className="text-gray-600">請選擇您的上車地點</p>
            <div className="text-sm text-gray-500 mt-2">
              現在時間: {currentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleStationSelect('公道五')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 px-6 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">公道五</span>
                  <span className="text-sm opacity-90">({stationInfo.公道五.note})</span>
                </div>
                <a
                  href={stationInfo.公道五.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition"
                >
                  <Map className="w-5 h-5" />
                </a>
              </div>
              <div className="text-left">
                {nextBuses.公道五 ? (
                  <div className="text-sm opacity-90">
                    下一班: <span className="font-bold text-lg">{nextBuses.公道五.time}</span> ({nextBuses.公道五.minutes}分鐘後)
                  </div>
                ) : (
                  <div className="text-sm opacity-90">已過末班車</div>
                )}
              </div>
            </button>
            
            <button
              onClick={() => handleStationSelect('展業二路')}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-6 px-6 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">展業二路</span>
                  <span className="text-sm opacity-90">({stationInfo.展業二路.note})</span>
                </div>
                <a
                  href={stationInfo.展業二路.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition"
                >
                  <Map className="w-5 h-5" />
                </a>
              </div>
              <div className="text-left">
                {nextBuses.展業二路 ? (
                  <div className="text-sm opacity-90">
                    下一班: <span className="font-bold text-lg">{nextBuses.展業二路.time}</span> ({nextBuses.展業二路.minutes}分鐘後)
                  </div>
                ) : (
                  <div className="text-sm opacity-90">已過末班車</div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">接駁車時刻表</h1>
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-sm opacity-90">
              現在時間: {currentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          {/* Route Info */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-white px-6 py-3 rounded-xl shadow-md relative">
                <div className="text-xs text-gray-500 mb-1">上車地點</div>
                <div className="text-lg font-bold text-blue-600 mb-1">{selectedStation}</div>
                <div className="text-xs text-gray-600">({stationInfo[selectedStation].note})</div>
                <a
                  href={stationInfo[selectedStation].mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                >
                  <Map className="w-5 h-5" />
                </a>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400" />
              <div className="bg-white px-6 py-3 rounded-xl shadow-md relative">
                <div className="text-xs text-gray-500 mb-1">目的地</div>
                <div className="text-lg font-bold text-indigo-600 mb-1">{destination}</div>
                <div className="text-xs text-gray-600">({stationInfo[destination].note})</div>
                <a
                  href={stationInfo[destination].mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 text-indigo-500 hover:text-indigo-700"
                >
                  <Map className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Next Bus */}
          <div className="p-6">
            {nextBus ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 mb-6">
                <div className="text-center">
                  <div className="text-green-600 font-semibold mb-2">下一班車</div>
                  <div className="text-6xl font-bold text-green-700 mb-4">{nextBus.time}</div>
                  <div className="inline-block bg-green-200 text-green-800 px-6 py-2 rounded-full font-semibold">
                    還有 {Math.floor(nextBus.minutes / 60)} 小時 {nextBus.minutes % 60} 分鐘
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-8 mb-6">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-red-600 mb-2">已過末班車</div>
                  <div className="text-gray-600">今日已無班次</div>
                </div>
              </div>
            )}

            {/* All Buses */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">今日所有班次</h2>
              <div className="grid grid-cols-2 gap-3">
                {allBuses.map((time, index) => {
                  const [hours, minutes] = time.split(':').map(Number);
                  const busMinutes = hours * 60 + minutes;
                  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                  const isPast = busMinutes <= currentMinutes;
                  const isNext = nextBus && time === nextBus.time;

                  return (
                    <div
                      key={index}
                      className={`
                        p-4 rounded-xl text-center font-semibold transition
                        ${isNext ? 'bg-green-500 text-white shadow-lg scale-105' : ''}
                        ${isPast && !isNext ? 'bg-gray-200 text-gray-400' : ''}
                        ${!isPast && !isNext ? 'bg-blue-100 text-blue-700' : ''}
                      `}
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">下一班</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-gray-600">未發車</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span className="text-gray-600">已發車</span>
              </div>
            </div>
          </div>

          {/* Change Location Button */}
          <div className="p-6 pt-0">
            <button
              onClick={() => setShowLocationSelect(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition"
            >
              更換上車地點
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShuttleBusSchedule;