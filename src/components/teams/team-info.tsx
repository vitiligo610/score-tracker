import { Team } from "@/lib/definitons";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CalendarRange, Edit, EditIcon, Trash, TrashIcon } from "lucide-react";

interface TeamInfoProps {
  team: Team;
}

const TeamInfo = ({ team }: TeamInfoProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="border-b">
        <div className="">
          <h3 className="text-3xl font-bold text-primary mb-2">{team.name}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-accent backdrop-blur-sm">
              <CalendarRange className="w-3 h-3 mr-1" />
              Est. {team.founded_year}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 h-24">
        <div className="flex items-start space-x-4">
          <Building2 className="w-5 h-5 text-primary mt-1" />
          <p className="text-sm leading-relaxed">
            {team.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button variant="default">
          <EditIcon /> Edit
        </Button>
        <Button variant="secondary">
          <TrashIcon className="h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TeamInfo;