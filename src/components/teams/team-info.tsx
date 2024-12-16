import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Team } from "@/lib/definitons";
import { Building2, CalendarRange, EditIcon, TrashIcon } from "lucide-react";
import TeamFormDialog from "./team-form-dialog";
import DeleteTeamButton from "./delete-team-button";
import Link from "next/link";

interface TeamInfoProps {
  team: Team;
}

const TeamInfo = ({ team }: TeamInfoProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="border-b">
        <div className="">
          <Link href={`/teams/${team.team_id}`} className="text-primary transition-all hover:text-primary/90">
            <h3 className="text-3xl font-bold mb-2">{team.name}</h3>
          </Link>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-accent backdrop-blur-sm">
              <CalendarRange className="w-3 h-3 mr-1" />
              Est. {team.founded_year}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 min-h-24">
        <div className="flex items-start space-x-4">
          <Building2 className="w-5 h-5 text-primary mt-1" />
          <p className="text-sm">
            {team.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <TeamFormDialog team={team}>
          <Button variant="default">
            <EditIcon /> Edit
          </Button>
        </TeamFormDialog>
        <DeleteTeamButton team_id={team.team_id} />
      </CardFooter>
    </Card>
  );
}

export default TeamInfo;