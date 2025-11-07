import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Zap, Brain, Database, TrendingUp } from "lucide-react";
import technologyBg from "@/assets/technology-bg.jpg";
import continuousLearning from "@/assets/continuous-learning.jpg";

export default function Technology() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={technologyBg} 
            alt="Technology Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="gradient-text-colorful">The Technology Behind Astarus</h1>
            <p className="text-xl text-muted-foreground">
              A revolutionary approach to continuous learning in large language models
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-foreground">Memory-Augmented Architecture</h2>
              <p className="text-lg text-muted-foreground">
                Our LUT (Lookup Table) augmented transformers represent a paradigm shift in how AI models learn and adapt.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">No Backpropagation Required</h4>
                    <p className="text-muted-foreground">Updates happen through simple table lookups, not expensive gradient descent</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Internal Embeddings</h4>
                    <p className="text-muted-foreground">Uses the model's native representation space for seamless integration</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Scalable Updates</h4>
                    <p className="text-muted-foreground">Add new knowledge by simply appending rows to the lookup table</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src={continuousLearning} 
                alt="Continuous Learning" 
                className="w-full rounded-lg shadow-xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-foreground mb-4">Proven Performance</h2>
            <p className="text-lg text-muted-foreground">
              Benchmarked across multiple model sizes and domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center card-hover border-2 border-primary/20">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">15-40%</div>
              <p className="text-sm text-muted-foreground">Perplexity Reduction</p>
            </Card>
            
            <Card className="p-6 text-center card-hover border-2 border-secondary/20">
              <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
              <div className="text-4xl font-bold text-secondary mb-2">&lt; 5s</div>
              <p className="text-sm text-muted-foreground">Training Time</p>
            </Card>
            
            <Card className="p-6 text-center card-hover border-2 border-accent/20">
              <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Knowledge Retention</p>
            </Card>
            
            <Card className="p-6 text-center card-hover border-2 border-success/20">
              <Database className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-4xl font-bold text-success mb-2">&lt; 1%</div>
              <p className="text-sm text-muted-foreground">Memory Overhead</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-foreground mb-12 text-center">How It Works</h2>
            
            <div className="space-y-8">
              <Card className="p-8 border-l-4 border-l-primary">
                <h3 className="text-2xl font-bold mb-4 text-primary">Step 1: Base Model Training</h3>
                <p className="text-muted-foreground">
                  Start with a standard transformer architecture trained on general data. This provides the foundational knowledge and language understanding capabilities.
                </p>
              </Card>
              
              <Card className="p-8 border-l-4 border-l-secondary">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Step 2: LUT Integration</h3>
                <p className="text-muted-foreground">
                  Add a lightweight lookup table layer to the final transformer block. This layer maps activation patterns to corrective logits without modifying the base model weights.
                </p>
              </Card>
              
              <Card className="p-8 border-l-4 border-l-accent">
                <h3 className="text-2xl font-bold mb-4 text-accent">Step 3: Continuous Adaptation</h3>
                <p className="text-muted-foreground">
                  As new data arrives, update the LUT by adding entries that steer predictions toward desired behaviors. This happens in seconds, not hours or days.
                </p>
              </Card>
              
              <Card className="p-8 border-l-4 border-l-success">
                <h3 className="text-2xl font-bold mb-4 text-success">Step 4: Real-Time Inference</h3>
                <p className="text-muted-foreground">
                  During inference, the model retrieves relevant corrections from the LUT and applies them to its outputs, enabling personalized responses without retraining.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
