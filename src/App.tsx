import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { SessionScreen } from './screens/SessionScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { BuilderScreen } from './screens/BuilderScreen';
import { ScheduleScreen } from './screens/ScheduleScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/session/:id" element={<SessionScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/builder" element={<BuilderScreen />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
