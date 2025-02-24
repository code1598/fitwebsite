import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Dumbbell } from "lucide-react";

export function NavBar() {
  const { logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="flex items-center space-x-2 font-bold text-xl">
                <Dumbbell className="h-6 w-6" />
                <span>FitLife</span>
              </a>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/">
                <a className="text-foreground/60 hover:text-foreground">Home</a>
              </Link>
              <Link href="/programs">
                <a className="text-foreground/60 hover:text-foreground">Programs</a>
              </Link>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
