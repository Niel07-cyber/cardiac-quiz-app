import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Stethoscope, Trophy, Database, Bot, GraduationCap, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import doctorVsAi from "@/assets/doctor-vs-ai.jpg";

const Index = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: "Analyze Videos",
      description: "View echocardiogram videos and analyze cardiac function",
      icon: Video,
    },
    {
      number: 2,
      title: "Make Diagnosis", 
      description: "Answer questions about cardiac conditions based on ultrasound data",
      icon: Stethoscope,
    },
    {
      number: 3,
      title: "Beat the AI",
      description: "Compare your diagnostic accuracy against our trained AI model",
      icon: Trophy,
    },
  ];

  const features = [
    {
      title: "Real Medical Data",
      description: "Authentic echocardiogram videos from clinical practice",
      icon: Database,
    },
    {
      title: "AI Competition", 
      description: "Challenge ML models trained on thousands of cases",
      icon: Bot,
    },
    {
      title: "Educational Value",
      description: "Learn from mistakes and improve diagnostic skills", 
      icon: GraduationCap,
    },
    {
      title: "Instant Feedback",
      description: "Get immediate results and explanations",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Header - Responsive */}
      <header className="bg-primary text-primary-foreground py-2 sm:py-3 px-3 sm:px-4 shadow-elegant">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">HealthEcho Game</h1>
          <p className="text-xs sm:text-sm opacity-90">Challenge AI in Medical Ultrasound Analysis</p>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 max-w-7xl">
        
        {/* How It Works - Responsive Column */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">How It Works</h2>
          <div className="space-y-2 sm:space-y-3">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.number} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                      {step.number}
                    </div>
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Data Source Section - Responsive */}
          <div className="mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Data Source</h3>
            <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-2 sm:gap-3">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 text-blue-900">Stanford Echocardiogram Dataset</h4>
                  <p className="text-xs text-blue-800 leading-relaxed mb-1">
                    The game uses authentic echocardiogram videos from clinical practice, sourced from validated Stanford medical datasets.
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>• <strong>200+ cardiac studies</strong> with validated measurements</p>
                    <p className="hidden sm:block">• <strong>EF values:</strong> Normal (&ge;55%), Reduced (40-54%), Abnormal (&lt;40%)</p>
                    <p className="block sm:hidden">• <strong>EF values:</strong> Normal/Reduced/Abnormal</p>
                    <p className="hidden sm:block">• <strong>Video format:</strong> MP4, 112x112 resolution, optimized for web</p>
                    <p className="block sm:hidden">• <strong>Video format:</strong> MP4, web-optimized</p>
                    <p className="hidden sm:block">• <strong>Metadata:</strong> ESV, EDV, frame dimensions, FPS, frame count</p>
                    <p className="block sm:hidden">• <strong>Metadata:</strong> ESV, EDV, frame data</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Game Features - Responsive Column */}
        <div className="lg:col-span-4">
          <Card className="bg-accent text-accent-foreground h-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-xl sm:text-2xl text-center">Game Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.title} className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-background/10">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5">
                      <IconComponent className="w-full h-full" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{feature.title}</h3>
                      <p className="text-xs sm:text-sm opacity-90 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section - Responsive Column */}
        <div className="lg:col-span-4">
          <Card className="text-center p-4 sm:p-6 shadow-elegant h-full flex flex-col justify-center">
            <div className="space-y-4 sm:space-y-6">
              {/* Doctor vs AI Image - Responsive */}
              <div className="mb-3 sm:mb-4">
                <img 
                  src={doctorVsAi} 
                  alt="Doctor challenging AI" 
                  className="w-full h-32 sm:h-48 object-cover rounded-lg shadow-md"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">
                  Ready to Challenge the AI?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  Put your medical knowledge to the test and see if you can outperform our AI.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-semibold shadow-red hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
                  onClick={() => navigate("/quiz")}
                >
                  Start Quiz vs AI
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </main>

      {/* Footer - Responsive */}
      <footer className="bg-muted border-t py-2 sm:py-3 px-3 sm:px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Data Mining • Johannes Gutenberg University • Mainz, Germany
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;