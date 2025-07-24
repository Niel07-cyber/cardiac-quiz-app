# HealthEcho Game

An interactive medical diagnostic game where users analyze echocardiogram videos and compete against AI models to diagnose cardiac conditions based on ejection fraction (EF) values. Features comprehensive cardiac metadata integration with real-time frame data and measurements display.

![HealthEcho Game](https://img.shields.io/badge/Medical-Diagnostic%20Game-blue) ![React](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-purple) ![Flask](https://img.shields.io/badge/Flask-2.3.3-green) ![Dataset](https://img.shields.io/badge/Videos-10%2C024-orange) ![Coverage](https://img.shields.io/badge/Metadata%20Coverage-99.95%25-brightgreen)

## 🎯 Overview

HealthEcho Game is an educational tool designed for medical professionals and students to practice echocardiogram interpretation. Users watch authentic ultrasound videos and answer diagnostic questions while competing against machine learning models trained on thousands of clinical cases.

## ✨ Features

- **Real Medical Data**: Authentic echocardiogram videos from clinical practice (10,030+ cases)
- **Comprehensive Metadata**: Real-time display of ES/ED frame numbers, EF, ESV, and EDV values
- **Complete Dataset Coverage**: 99.95% metadata coverage for seamless video analysis
- **AI Competition**: Challenge ML models (LightGBM) trained on medical datasets
- **Interactive Quiz**: Progressive question system with immediate feedback
- **Video Playback Controls**: Adjustable speed controls (0.5x - 1.5x) for detailed analysis
- **Cardiac Function Analysis**: Live visualization of systolic and diastolic measurements
- **Score Tracking**: Compare your diagnostic accuracy against AI predictions
- **Modern UI**: Built with ShadcnUI and Tailwind CSS for a professional interface
- **Responsive Design**: Full-width layout optimized for medical workstations

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Components**: ShadcnUI + Radix UI primitives
- **Styling**: Tailwind CSS with custom medical theme
- **State Management**: React hooks for quiz state
- **Routing**: React Router for navigation

### Backend (Flask + Python)
- **API Server**: Flask with CORS support
- **ML Models**: LightGBM for cardiac function prediction
- **Data Processing**: Pandas for CSV data handling
- **Video Serving**: Static file serving for MP4 echocardiograms
- **Results Storage**: CSV-based score tracking

## 📁 Project Structure

```
├── src/
│   ├── components/ui/          # ShadcnUI component library
│   ├── pages/
│   │   ├── Index.tsx          # Homepage with game introduction
│   │   ├── QuizPageOriginal.tsx # Main quiz interface
│   │   └── NotFound.tsx       # 404 page
│   ├── lib/
│   │   └── videoData.ts       # Complete video metadata (10,024+ entries)
│   ├── types/
│   │   └── quiz.ts            # TypeScript interfaces
│   └── assets/                # Images and static assets
├── backend/
│   ├── API_server_original.py # Flask API server
│   ├── requirements.txt       # Python dependencies
│   ├── quiz_question.json     # Static quiz questions
│   ├── lightgbm_model.pkl     # Trained ML model
│   ├── label_encoder.pkl      # ML preprocessing encoder
│   ├── FileList.csv          # Video metadata (10,030 entries)
│   └── results.csv           # User score history
├── public/
│   └── mp4/                   # Echocardiogram video files (10,030+ videos)
├── VolumeTracings.csv         # Frame data (425,010 entries)
├── fix_video_data.py          # Data extraction script
├── package.json               # Node.js dependencies
└── vite.config.ts            # Vite configuration
```

## 🩺 Cardiac Data Integration

### Data Sources
- **VolumeTracings.csv**: 425,010 frame-level volume measurements
- **FileList.csv**: 10,030 video metadata entries with cardiac measurements
- **Complete Coverage**: 10,024 videos with both frame and cardiac data (99.95% coverage)

### Extracted Metadata
- **ES (End Systole)**: Frame number at minimum ventricular volume
- **ED (End Diastole)**: Frame number at maximum ventricular volume  
- **EF (Ejection Fraction)**: Cardiac pumping efficiency percentage
- **ESV (End Systolic Volume)**: Minimum ventricular volume (ml)
- **EDV (End Diastolic Volume)**: Maximum ventricular volume (ml)

### Data Processing Pipeline
```python
# Automated data extraction using fix_video_data.py
VolumeTracings.csv → Frame Data (ES/ED) → videoData.ts
FileList.csv → Cardiac Data (EF/ESV/EDV) → Real-time Display
```

### Medical Classifications
- **Normal**: EF ≥ 55% (Normal cardiac function)
- **Reduced**: EF 40-54% (Mildly reduced function)  
- **Abnormal**: EF < 40% (Severely reduced function)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/healthecho-game.git
   cd healthecho-game
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Generate video metadata (if needed)**
   ```bash
   python fix_video_data.py
   ```
   This extracts complete cardiac data from CSV files and updates `src/lib/videoData.ts`

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python API_server_original.py
   ```
   The Flask server will start at `http://127.0.0.1:5000`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The React app will be available at `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Start the Quiz**: Click "Start the test" on the homepage
2. **Watch Videos**: Analyze echocardiogram videos using playback controls
3. **View Metadata**: See real-time ES/ED frame numbers and cardiac measurements (EF, ESV, EDV)
4. **Answer Questions**: Select the most appropriate cardiac function classification
5. **Get Feedback**: Receive immediate results and AI comparison
6. **Track Progress**: View your score progression throughout the quiz
7. **Final Results**: Compare your overall performance against the AI model

## 🎛️ Video Controls

- **Playback Speed**: Adjust video speed from 0.5x to 1.5x for detailed analysis
- **Standard Controls**: Play, pause, seek, and volume controls
- **Auto-Reset**: Speed resets to 1x when starting new questions

## 📊 Scoring System

- **User Score**: Points awarded for correct diagnoses
- **AI Score**: Parallel scoring by machine learning model
- **Comparison**: Real-time tracking of human vs. AI performance
- **Results Storage**: Scores saved with timestamps for progress tracking

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern hooks-based architecture
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **ShadcnUI**: Professional component library
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Medical icons and indicators
- **React Router**: Client-side routing

### Backend
- **Flask 2.3.3**: Lightweight web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Pandas**: Data manipulation and analysis
- **LightGBM**: Gradient boosting ML framework
- **Scikit-learn**: Machine learning utilities
- **NumPy**: Numerical computing

## 🔧 Configuration

### Environment Variables
No environment variables required for basic setup.

### Model Configuration
- ML models are pre-trained and included as `.pkl` files
- Video metadata is configured in `FileList.csv` and `VolumeTracings.csv`
- Complete dataset generated automatically with `fix_video_data.py`
- Quiz questions can be modified in `quiz_question.json`

### Data Requirements
- **VolumeTracings.csv**: Must be in root directory (425,010 entries)
- **backend/FileList.csv**: Video metadata file (10,030 entries)
- **public/mp4/**: Directory containing echocardiogram videos
- **src/lib/videoData.ts**: Auto-generated metadata file (do not edit manually)

## 🐛 Troubleshooting

### Common Issues
- **"No frame data found"**: Run `python fix_video_data.py` to regenerate metadata
- **Missing videos**: Ensure MP4 files are in `public/mp4/` directory
- **Import errors**: Check that CSV files are in correct locations
- **TypeScript errors**: Regenerate `videoData.ts` if structure changes
- **Port conflicts**: Backend runs on 5000, frontend on 5173 (or 8080)

## 📝 API Endpoints

- `GET /api/questions` - Fetch quiz questions and video metadata from 10,030+ cases
- `POST /api/predict` - Get AI predictions for cardiac function classification
- `POST /api/submit_results` - Submit user scores and get AI comparison
- `GET /api/videos/<filename>` - Serve echocardiogram video files with streaming support
- Video metadata automatically loaded from `videoData.ts` with 99.95% coverage

## 🔍 Data Extraction Process

### Complete Metadata Generation
The `fix_video_data.py` script processes the raw medical data:

```python
# Extract frame data from VolumeTracings.csv
for filename in volume_df['FileName'].unique():
    video_traces = volume_df[volume_df['FileName'] == filename]
    frames = sorted(video_traces['Frame'].values)
    es_frame = frames[0]  # End Systole
    ed_frame = frames[-1]  # End Diastole

# Extract cardiac measurements from FileList.csv  
for _, row in file_df.iterrows():
    cardiac_data[filename] = {
        'ef': round(row['EF'], 2),    # Ejection Fraction
        'esv': round(row['ESV'], 2),  # End Systolic Volume
        'edv': round(row['EDV'], 2)   # End Diastolic Volume
    }
```

### Results
- **Frame Data**: 10,025 videos with ES/ED frame numbers
- **Cardiac Data**: 10,030 videos with EF/ESV/EDV measurements
- **Complete Dataset**: 10,024 videos with both frame and cardiac data
- **Coverage**: 99.95% success rate for metadata display

## 🚀 Recent Updates & Improvements

### v2.0 - Comprehensive Cardiac Data Integration
- ✅ **Complete Dataset**: Upgraded from ~50 videos to 10,024+ with full metadata
- ✅ **Real-time Display**: ES/ED frame numbers and cardiac measurements shown during quiz
- ✅ **99.95% Coverage**: Eliminated "No frame data found" errors
- ✅ **Automated Extraction**: `fix_video_data.py` processes 425K+ data points
- ✅ **Medical Accuracy**: Proper ES/ED frame identification from volume tracings
- ✅ **Performance**: Instant metadata lookup for 10,000+ videos

### Technical Architecture Enhancements
- **videoData.ts**: Complete metadata integration with TypeScript interfaces
- **Backend Optimization**: Serves random videos from full 10,030 video dataset  
- **Frontend Enhancement**: Real-time cardiac measurement display
- **Data Pipeline**: Automated CSV-to-TypeScript conversion workflow

## 🎨 UI/UX Features

- **Medical Theme**: Professional color scheme suitable for clinical environments
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Layout**: Optimized for various screen sizes
- **Progress Indicators**: Visual feedback on quiz completion
- **Loading States**: Smooth transitions and loading animations

## 🧪 Development

### Build Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint code checking
```

### Project Standards
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code quality and consistency
- **Component Architecture**: Reusable UI components
- **Clean Code**: Modular structure with clear separation of concerns

## 🎓 Educational Value

This project serves as:
- **Medical Training Tool**: Practice echocardiogram interpretation with real clinical data
- **Cardiac Function Analysis**: Learn ES/ED frame identification and EF calculation
- **Large Dataset Experience**: Work with 10,000+ authentic medical videos
- **AI Comparison Study**: Understand ML model capabilities in medical diagnosis
- **Interactive Learning**: Immediate feedback with detailed cardiac measurements
- **Clinical Data Experience**: Hands-on experience with volume tracings and cardiac metrics
- **Medical Data Processing**: Learn data extraction from clinical CSV files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is developed for educational purposes as part of a Data Mining course at Johannes Gutenberg University, Mainz, Germany.

## 🏥 Medical Disclaimer

This tool is for educational purposes only and should not be used for actual medical diagnosis. Always consult qualified healthcare professionals for medical decisions.

## 📞 Support

For technical support or questions about the project, please contact the development team through the university's Data Mining course channels.

---

**Data Mining • Johannes Gutenberg University • Mainz, Germany**
