import { NavBar } from "@/components/nav-bar";
import { ProgramCard } from "@/components/program-card";
import { useQuery } from "@tanstack/react-query";
import { WorkoutProgram } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function ProgramsPage() {
  const { data: programs, isLoading } = useQuery<WorkoutProgram[]>({
    queryKey: ["/api/programs"],
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Workout Programs</h1>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs?.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </TabsContent>

            {["beginner", "intermediate", "advanced"].map((level) => (
              <TabsContent key={level} value={level} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {programs
                    ?.filter((program) => program.level === level)
                    .map((program) => (
                      <ProgramCard key={program.id} program={program} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
