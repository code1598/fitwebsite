import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { WorkoutProgram } from "@shared/schema";

export function ProgramCard({ program }: { program: WorkoutProgram }) {
  return (
    <Card>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={program.imageUrl}
          alt={program.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{program.name}</CardTitle>
          <Badge>{program.level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{program.description}</p>
        <Accordion type="single" collapsible>
          <AccordionItem value="exercises">
            <AccordionTrigger>View Exercises</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {program.exercises.map((exercise, index) => (
                  <li key={index} className="border-b pb-2">
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} | Rest: {exercise.restTime}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
