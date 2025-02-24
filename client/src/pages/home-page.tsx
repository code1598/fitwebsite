import { NavBar } from "@/components/nav-bar";
import { BMICalculator } from "@/components/bmi-calculator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
              alt="Gym"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Welcome to FitLife
                </h1>
                <p className="text-xl max-w-2xl mx-auto">
                  Your journey to a healthier lifestyle starts here
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Calculate Your BMI</h2>
          <BMICalculator />
        </section>
      </main>
    </div>
  );
}
